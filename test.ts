const getMax = (nums: number[]): number => {
    if (nums.length === 1)
      return nums[0];
    return Math.max(nums.shift() || 0, getMax(nums));
  }

  const getMin = (nums: number[]): number => {
    if (nums.length === 1)
      return nums[0];
    const val = nums.shift() || 0;
    const subMin = getMin(nums);
    return val < subMin? val: subMin;
    
  }

  const quickSort = (nums: (number) [] ): (number) [] => {
    if(nums.length < 2) 
      return nums;

    const pivot: number = nums[0];
    const smallers: number [] =nums.filter(num => (num < pivot));
    const greaters: number [] = nums.filter(num => (num > pivot));
    
    return quickSort(smallers).concat([pivot, ...quickSort(greaters)]);
  }


  const merge = (nums1: number [], nums2: number [], nums: number []) => {
    let current1 = 0;
    let current2 = 0;
    let current3 = 0;
    while(current1 < nums1.length && current2 < nums2.length) {
      if(nums1[current1] < nums2[current2]) {
        nums[current3++] = nums1[current1++];
      }else {
        nums[current3++] = nums2[current2++];
      }
    }

    while(current1 < nums1.length) {
      nums[current3++] = nums1[current1++];
    }

    while(current2 < nums2.length) {
      nums[current3++] = nums2[current2++];
    }

    console.log(nums1, nums2, nums);
    
    return nums;

  }

  const mergeSort = (nums: number []) => {
    if(nums.length > 1) {
      const leftSubArray: number [] = nums.slice(0, Math.floor(nums.length / 2));
      const rightSubArray: number [] = nums.slice(Math.floor(nums.length / 2) + 1, nums.length);

      mergeSort(leftSubArray);
      mergeSort(rightSubArray);
      merge(leftSubArray, rightSubArray, nums);
    } 
  }

  const dijkStrasSearch = (root: Node) => {
      // implement the graph structure
      // TODO: Implement ythe graph structure for the dijkstras algorithim
  }

  // console.log(getMax([2, 7, 8, 4, 6, 9, 8]));
  // console.log(getMin([2, 7, 8, 4, 6, 9, 8]));
  console.log(quickSort([2, 7, 8, 4, 6, 9, 8, 0, 9]));
  // const nums = [2, 7, 8, 4, 6, 9, 8, 0, 9];
  // mergeSort(nums);
  // console.log(nums);
  