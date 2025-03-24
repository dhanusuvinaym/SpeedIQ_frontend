import React from "react"
export function now() {
    const now = new Date();

    // Construct the formatted date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Combine the parts in the desired format
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function formatDuration(durationInMs) {
    // Calculate time components from duration in milliseconds
    const hours = Math.floor(durationInMs / (60 * 60 * 1000)); // Convert to hours
    const minutes = Math.floor((durationInMs % (60 * 60 * 1000)) / (60 * 1000)); // Remainder in minutes
    const seconds = Math.floor((durationInMs % (60 * 1000)) / 1000); // Remainder in seconds
    const milliseconds = durationInMs % 1000; // Remaining milliseconds

    // Format and replace the colon in milliseconds with a period
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}
