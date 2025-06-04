import { useSelector } from 'react-redux';

function Loading() {
  const isLoading = useSelector((state) => state.loadingBar?.default ?? 0);

  return (
    <div className={`loading ${isLoading === 0 ? 'd-none' : ''}`}>
      <div className='loader'></div>
    </div>
  );
}

export default Loading;
