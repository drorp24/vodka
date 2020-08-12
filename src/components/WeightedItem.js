import React from 'react';

export default function WeightedItem({weightName, weightValue}){
    return (
        <div>
            {weightName}: {weightValue}
        </div>
    )
}