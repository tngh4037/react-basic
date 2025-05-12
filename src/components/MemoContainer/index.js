import './index.css';

function MemoContainer({ memo, setMemo }) {
  // 참고) 빈 배열인데, 배열[0] 으로 접근시 undefined
  if (memo === undefined) {
    return (
      <div>
        <h1>메모가 없습니다.</h1>
        <h2>새로운 메모를 추가해 주세요.</h2>
      </div>
    );
  }

  return (
    <div className="MemoContainer">
      <div>
        <input
          type="text"
          className="MemoContainer__title"
          value={memo.title}
          onChange={(e) => {
            setMemo({
              ...memo,
              title: e.target.value,
              updatedAt: new Date().getTime(),
            });
          }}
        />
      </div>
      <div>
        <textarea
          className="MemoContainer__content"
          value={memo.content}
          onChange={(e) => {
            setMemo({
              ...memo,
              content: e.target.value,
              updatedAt: new Date().getTime(),
            });
          }}
        />
      </div>
    </div>
  );
}

export default MemoContainer;
