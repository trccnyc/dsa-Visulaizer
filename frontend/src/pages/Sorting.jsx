import { useRef, useState } from 'react';
import '../App.css';

function Sorting() {
  const [arr, setArr] = useState([]);
  const [speed,setSpeed]=useState(1);
  const [arraySize, setArraySize] = useState(43);
  const [isValid, setIsValid] = useState(true);
  const [qpivot,setPivot]=useState();
  const [comparingIndices, setComparingIndices] = useState([]);
  const [tempArray, setTempArray] = useState([]);
  const sortCanceled = useRef(false);

  const handleChange = (e) => {
    const value = e.target.value;
    const numericValue = parseInt(value);

    if (value === '') {
      setIsValid(true);
      setArraySize('');
    } else if (isNaN(numericValue) || numericValue > 120 || numericValue < 3) {
      setIsValid(false);
      setArraySize(value);
    } else {
      setIsValid(true);
      setArraySize(numericValue);
    }
  };

  const generateRandomArray = () => {
    if (!isValid || arraySize === '') return;
    sortCanceled.current = true;
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 100 + 1));
    }
    setArr(newArray);
    console.log(newArray);
  };

  const mergeSort = async (arr1, l, r) => {
    if (sortCanceled.current) return;
    if (l >= r) return;
    let m = Math.floor((l + r) / 2);
    await mergeSort(arr1, l, m);
    await mergeSort(arr1, m + 1, r);
    await merge(arr1, l, m, r);
  };

  const merge = async (arr1, l, m, r) => {
    if (sortCanceled.current) return;
    let v = Array(r - l + 1);
    setTempArray([]);
    let i = l, j = m + 1, k = 0;

    while (i <= m && j <= r) {
      if (sortCanceled.current) return;
      setComparingIndices([i, j]);
      await new Promise((resolve) => setTimeout(resolve, 50/speed));

      if (arr1[i] < arr1[j]) {
        v[k] = arr1[i];
        i++;
      } else {
        v[k] = arr1[j];
        j++;
      }
      setTempArray([...v.slice(0, k + 1)]);
      k++;
    }

    while (i <= m) {
      if (sortCanceled.current) return;
      v[k] = arr1[i];
      i++;
      k++;
      setTempArray([...v.slice(0, k)]);
    }

    while (j <= r) {
      if (sortCanceled.current) return;
      v[k] = arr1[j];
      j++;
      k++;
      setTempArray([...v.slice(0, k)]);
    }

    for (let p = 0; p < v.length; p++) {
      arr1[l + p] = v[p];
    }

    setArr([...arr1]);
    setComparingIndices([]);
    setTempArray([]);
    await new Promise((resolve) => setTimeout(resolve, 50/speed));
  };
  const bubbleSort=async(arr1)=>{
    for(let i=arraySize-1;i>1;i--){
      for(let j=0;j<i;j++){
        if(arr1[j]>arr1[j+1])[arr1[j+1],arr1[j]]=[arr1[j],arr1[j+1]];
        setComparingIndices([j,j+1]);
        setArr(arr1);
        await new Promise((resolve) => setTimeout(resolve, 50/speed));
      }
    }
  }
  const partition=async(arr1,low,high)=>{
    
    let i=low+1,j=high;
    const pivot=arr1[low];
    setPivot(low);
    while(i<=j){
        while (i <= j && arr1[i] <= pivot) {
          i++;setComparingIndices([i]);
          await new Promise(resolve => setTimeout(resolve, 50/speed));
        }
        while (i <= j && arr1[j] > pivot) {
          j--;
        setComparingIndices([j]);
        await new Promise(resolve => setTimeout(resolve, 50/speed));
        }
        if(i<j){
          setComparingIndices([i,j]);
          [arr1[i],arr1[j]]=[arr1[j],arr1[i]];
          await new Promise(resolve => setTimeout(resolve, 50/speed));
          setArr([...arr1]);
          await new Promise(resolve => setTimeout(resolve, 50/speed));
        }
    }
    setComparingIndices([]);
    [arr1[low],arr1[j]]=[arr1[j],arr1[low]];
    setArr([...arr1]);
    await new Promise(resolve => setTimeout(resolve, 50/speed));
    return j;
  }
  const quickSort=async(arr1,low,high)=>{
      if(sortCanceled.current) return;
      if(low<high){
        let pa=await partition(arr1,low,high);
        await quickSort(arr1,low,pa-1);
        await quickSort(arr1,pa+1,high);
        setPivot(null);
      }
  }
  const handleQuickSort = async () => {
    if(sortCanceled.current==false)return;
    sortCanceled.current = false;
    let arrCopy = [...arr];
    console.log('quicksort called');
    await quickSort(arrCopy,0,arrCopy.length-1);
    console.log(arrCopy);
  };
  const handleBubbleSort = async () => {
    if(sortCanceled.current==false)return;
    sortCanceled.current = false;
    let arrCopy = [...arr];
    await bubbleSort(arrCopy);
  };
  const handleMergeSort = async () => {
    if(sortCanceled.current==false)return;
    sortCanceled.current = false;
    let arrCopy = [...arr];
    await mergeSort(arrCopy, 0, arrCopy.length - 1);
  };

  return (
    <>
      <div className="card">
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {arr.map((length, index) => (
              <div
                key={index}
                style={{
                  width: `${arr.length > 80 ? 2 : 5}px`,
                  height: `${length * 2}px`,
                  backgroundColor:
                    comparingIndices.includes(index)
                      ? 'red' 
                      : qpivot==index?'blue'
                      :'white' ,
                      
                  margin: '0 5px',
                }}
              ></div>
            ))}
          </div>
          
            <div
            style={{ height:'200px' ,display: 'flex', alignItems: 'flex-end' }}
            >
              {tempArray.map((length, index) => (
                <div
                  key={index}
                  style={{
                    width: `${arr.length > 80 ? 2 : 5}px`,
                    height: `${length * 2}px`,
                    backgroundColor: 'yellow', // Highlight merged elements
                    margin: '0 5px',
                  }}
                ></div>
              ))}
            </div>
      </div>
      <div className="card">
        <label htmlFor="arraySizeInput" style={{ marginRight: '10px' }}>
          Array Size:
        </label>
        <input
          type="number"
          value={arraySize}
          onChange={handleChange}
          placeholder="Enter a number between 3 and 120..."
          style={{
            borderColor: isValid ? 'initial' : 'red',
            outline: isValid ? 'initial' : 'red',
          }}
        />
      </div>
      <label >
          Speed:
        </label>
      <select value={speed} onChange={(e)=> setSpeed(Number(e.target.value))}
                className="select-box border border-gray-500 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500" >
                <option value='0.10'>0.1</option>
                <option value='0.25'>0.25</option>
                <option value='0.5'>0.5</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
        </select>
      <div className="card">
        <button onClick={generateRandomArray}>
          Generate Array
        </button>
        <button onClick={handleMergeSort}>
          Merge Sort
        </button>
        <button onClick={handleBubbleSort}>
          Bubble Sort
        </button>
        <button onClick={handleQuickSort}>
          Quick Sort
        </button>
      </div>
    </>
  );
}

export default Sorting;
