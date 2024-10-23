import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";

const QuickSort = () => {
    const [n, setN] = useState(0);
    const [positions, setPositions] = useState([]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [pivotIndex, setPivotIndex] = useState(null);  // To track the pivot index
    const [smallerThan, setSmallerThan] = useState([]);  // Track elements smaller than the pivot
    const [largerThan, setLargerThan] = useState([]);    // Track elements larger than the pivot
    const [equalTo, setEqualTo] = useState([]);          // Track elements equal to the pivot
    const boxRefs = useRef([]);
    const stackRef = useRef([]);  // Stack to store array swaps during quickSort
    const [isSorting, setIsSorting] = useState(false);   // To track sorting state

    // Handle the click on each box to select or swap
    const handleBoxClick = (index) => {
        if (selectedBox === null) {
            setSelectedBox(index);
        } else {
            swapBoxes(selectedBox, index);
            setSelectedBox(null);
        }
    };

    // Function to swap the positions of two boxes
    const swapBoxes = (index1, index2) => {
        const newPositions = [...positions];
        [newPositions[index1], newPositions[index2]] = [newPositions[index2], newPositions[index1]];
        setPositions(newPositions);
    };

    const randomiseArray = () => {
        let newArr = [...positions];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        setPositions(newArr);
        stackRef.current = [];  // Reset the stack when the array is randomized
        resetBuckets();         // Reset smallerThan, largerThan, equalTo buckets
    };

    // Reset the buckets to an empty state
    const resetBuckets = () => {
        setSmallerThan([]);
        setLargerThan([]);
        setEqualTo([]);
    };

    // Use effect to update positions whenever `n` changes
    useEffect(() => {
        if (n > 0) {
            const initialPositions = [];
            for (let i = 1; i <= n; i++) {
                initialPositions.push(i);
            }
            setPositions(initialPositions);
        }
    }, [n]);

    // Use frame to update box positions dynamically
    useFrame(() => {
        positions.forEach((boxHeight, index) => {
            if (boxRefs.current[index]) {
                // Update position based on the height
                boxRefs.current[index].position.set(index * 2 - (positions.length - 1), boxHeight / 2, 0);
            }
        });
    });

    // The QuickSort function that generates steps and adds them to the stack
    const quickSort = (arr, low, high) => {
        if (low < high) {
            const pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    };

    // Partition function that handles the buckets (smaller, equal, larger than pivot)
    const partition = (arr, low, high) => {
        const pivot = arr[high];  // Choose the last element as the pivot
        setPivotIndex(high);      // Set the current pivot index
        let i = low - 1;
        const smaller = [];
        const larger = [];
        const equal = [pivot];    // Start with the pivot in the "equal" bucket

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                smaller.push(arr[j]);  // Push into "smaller than" bucket
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            } else if (arr[j] > pivot) {
                larger.push(arr[j]);   // Push into "larger than" bucket
            }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        stackRef.current.push([...arr]);  // Push the step onto the stack

        // Update the bucket states for visualization
        setSmallerThan(smaller);
        setEqualTo(equal);
        setLargerThan(larger);

        return i + 1;  // Return the index of the pivot
    };

    const startQuickSort = () => {
        if (isSorting) return;  // Prevent restarting while sorting
        setIsSorting(true);
        resetBuckets();         // Reset the buckets at the start
        quickSort([...positions], 0, positions.length - 1);
    };

    // Function to visualize the next step
    const nextStep = () => {
        if (stackRef.current.length > 0) {
            const nextPositions = stackRef.current.shift();  // Pop the next step from the stack
            setPositions(nextPositions);
        } else {
            setIsSorting(false);  // No more steps to visualize
            setPivotIndex(null);  // Reset pivot index after sorting
        }
    };

    const Larger = ({ arr }) => {
        return (
            <>
                {positions.map((boxHeight, index) => (
                    <mesh
                        key={index}
                        ref={(el) => (boxRefs.current[index] = el)}  // Assign ref to each box
                        onClick={() => handleBoxClick(index)}
                        position={[index * 2 - (positions.length - 1), (boxHeight / 2) - 10, 0]}  // Initial position
                    >
                        {/* Highlight the buckets or the pivot */}
                        <boxGeometry args={[1, boxHeight, 1]} />
                        <meshStandardMaterial color={
                            smallerThan.includes(positions[index]) ? 'green' :     // Smaller than pivot
                                equalTo.includes(positions[index]) ? 'blue' :          // Equal to pivot
                                    largerThan.includes(positions[index]) ? 'purple' :     // Larger than pivot
                                        (pivotIndex === index ? 'yellow' : (selectedBox === index ? 'red' : 'orange'))  // Highlight pivot or selected
                        } />
                    </mesh>
                ))}
            </>)
    }


    const Smaller = ({ arr }) => {
        return (
            <group position={[0,-7,0]}>
                    <Text>Smaller Than</Text>
                {positions.map((val, index) => (
                    <Text key={index} position={[0,index*2,0]}>{val}</Text>
                ))}
            </group>
            )
    }


    const BoxScene = ({ positions }) => {
        return (
            <>
                {positions.map((boxHeight, index) => (
                    <mesh
                        key={index}
                        ref={(el) => (boxRefs.current[index] = el)}  // Assign ref to each box
                        onClick={() => handleBoxClick(index)}
                        position={[index * 2 - (positions.length - 1), boxHeight / 2, 0]}  // Initial position
                    >
                        {/* Highlight the buckets or the pivot */}
                        <boxGeometry args={[1, boxHeight, 1]} />
                        <meshStandardMaterial color={
                            smallerThan.includes(positions[index]) ? 'green' :     // Smaller than pivot
                                equalTo.includes(positions[index]) ? 'blue' :          // Equal to pivot
                                    largerThan.includes(positions[index]) ? 'purple' :     // Larger than pivot
                                        (pivotIndex === index ? 'yellow' : (selectedBox === index ? 'red' : 'orange'))  // Highlight pivot or selected
                        } />
                    </mesh>
                ))}
                <group position={[0, -2, 0]}>
                    <Text
                        color="black"
                        anchorX="center"
                        anchorY="top"
                        position={[0, -2, 0]}
                        onPointerDown={() => randomiseArray()}
                    >
                        Randomise Array
                    </Text>
                    {isSorting && stackRef.current.length > 0 &&
                        <Text
                            color="black"
                            anchorX="center"
                            anchorY="bottom"
                            position={[0, -1, 0]}
                            onPointerDown={() => nextStep()}  // Show the next step when clicked
                        >
                            Next Step
                        </Text>
                    }
                    {!isSorting &&
                        <Text
                            color="black"
                            anchorX="center"
                            anchorY="middle"
                            onPointerDown={() => startQuickSort()}
                        >
                            Start QuickSort
                        </Text>
                    }
                </group>
            </>
        );
    };

    const ChoiceOfN = () => {
        return (
            <>
                <Text
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    onPointerDown={() => setN(10)}
                >
                    Start Sorting!
                </Text>
            </>
        );
    };

    return (
        <>
            {n > 0 ? <BoxScene positions={positions} /> : <ChoiceOfN />}
            {smallerThan.length > 0 && <Smaller arr={smallerThan} />}
            {largerThan.length > 0 && <Larger arr={largerThan} />}
            {/* {largerThan.length > 0 && <BoxScene2 positions={largerThan} />} */}
        </>
    );
};

export default QuickSort;
