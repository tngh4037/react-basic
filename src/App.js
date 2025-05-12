import { useCallback, useState } from 'react';
import './App.css';
import MemoContainer from './components/MemoContainer'; // 폴더 지정 후 아무것도 안적어주면, 알아서 폴더 안에 있는 index.js 를 임포트한다.
import SideBar from './components/SideBar';
import { getItem, setItem } from './lib/storage';
import debounce from 'lodash.debounce';

// setItem 이 여러번 호출될 때, 마지막 호출로부터 5초가 지난 시점에, 지금까지의 호출을 묶어서 한번만 setItem을 호출한다.
const debouncedSetItem = debounce(setItem, 5000); // debounce 가 적용된 setItem 함수를 리턴 (setItem 은 그대로 있음)

function App() {
  /*
  const [memos, setMemos] = useState([
    {
      title: 'Memo 1',
      content: 'This is memo 1',
      createdAt: 1641225302265,
      updatedAt: 1641225302265,
    },
    {
      title: 'Memo 2',
      content: 'This is memo 2',
      createdAt: 1641225309267,
      updatedAt: 1641225309267,
    },
  ]);
  */
  const [memos, setMemos] = useState(getItem('memo') || []);

  // 선택한 메모의 번호를 저장하는 state ( 초기값: 첫 번째 메모 )
  const [selectedMemoIndex, setSelectedMemoIndex] = useState(0);

  const setMemo = useCallback(
    (newMemo) => {
      // const newMemos = [...memos];
      // newMemos[selectedMemoIndex] = newMemo;
      // setMemos(newMemos);

      // memos[selectedMemoIndex] = newMemo; // 참고1) 이렇게 직접 memos 요소를 바꿔버리면 불변성이 깨진다. 그러면 아래 setMemos 가 처리되는 중에 다른 곳에서 memos 에 접근하게 되면 데이터 신뢰성이 떨어질 수 있다. 따라서 위와 같이 미리 새로운 배열에 넣어두고 작업하는 것이 좋다.
      // setMemos([...memos]); // 참고2) setMemos(memos); 와 같이 하면 안된다. memos 의 특정 요소를 변경하더라도, memos 가 가지고 있는 레퍼런스는 그대로 이기 때문에, setMemos 는 내부에서 상태(state)가 변화했다고 인지하지 못한다. 그래서 실제 데이터는 내부에서 변경되었으나, 화면에는 반영되지 않는다. (리렌더링X) ==> 따라서 메모 변경시, memos 가 다른 레퍼런스를 갖도록 해야한다. ( 해결 방안: [...memos] 로 배열 안의 요소를 꺼내서, 다시 배열로 생성해주어야 한다. (그래야 memos의 레퍼런스가 변경된다.) )

      setMemos((memos) => {
        const newMemos = [...memos];
        newMemos[selectedMemoIndex] = newMemo;

        // localStorage 에 저장
        debouncedSetItem('memo', newMemos);

        return newMemos;
      });
    },
    [selectedMemoIndex],
  );

  const addMemo = useCallback(() => {
    setMemos((memos) => {
      const now = new Date().getTime();

      // 기존 데이터 뒤에 하나의 메모 데이터 추가
      const newMemos = [
        ...memos,
        {
          title: 'Untitled',
          content: '',
          createdAt: now,
          updatedAt: now,
        },
      ];

      // localStorage 에 저장
      debouncedSetItem('memo', newMemos);

      return newMemos;
    });

    // 추가하고, 추가된 메모가 자동 선택되도록
    setSelectedMemoIndex(memos.length);
  }, [memos]);

  const deleteMemo = useCallback(
    (index) => {
      setMemos((memos) => {
        const newMemos = [...memos]; // 참고) 불변성을 위해 새로 생성해서 변경
        newMemos.splice(index, 1);

        // localStorage 에 저장
        debouncedSetItem('memo', newMemos);

        return newMemos;
      });

      // 선택된 메모를 삭제하는 경우, 첫 번째 메모가 자동 선택되도록 적용
      if (index === selectedMemoIndex) {
        setSelectedMemoIndex(0);
      }
    },
    [selectedMemoIndex],
  );

  return (
    <div className="App">
      <SideBar
        memos={memos}
        addMemo={addMemo}
        selectedMemoIndex={selectedMemoIndex}
        setSelectedMemoIndex={setSelectedMemoIndex}
        deleteMemo={deleteMemo}
      />
      <MemoContainer memo={memos[selectedMemoIndex]} setMemo={setMemo} />
    </div>
  );
}

export default App;
