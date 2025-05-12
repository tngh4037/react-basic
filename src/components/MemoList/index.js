import MemoItem from '../MemoItem';

function MemoList({
  memos,
  setSelectedMemoIndex,
  selectedMemoIndex,
  deleteMemo,
}) {
  return (
    <div>
      {memos.map((memo, index) => (
        <MemoItem
          key={index}
          onClickItem={() => {
            setSelectedMemoIndex(index);
          }}
          onClickDelete={(e) => {
            e.preventDefault(); // 참고) MemoItem 에서 X 클릭시, 그 부모인 div 태그에도 onClick 이 있기때문에, 캡쳐링/버블링 관련 문제 발생
            e.stopPropagation();

            deleteMemo(index);
          }}
          isSelected={index === selectedMemoIndex}
        >
          {memo.title}
        </MemoItem>
      ))}
    </div>
  );
}

export default MemoList;
