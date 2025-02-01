export const formatDuration = (totalSeconds) => {
    // Convert duration to hours, minutes and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    // Format based on whether hours exist
    if (hours > 0) {
      // Format: "2:32 hr" for hours
      return `${hours}:${minutes.toString().padStart(2, '0')} hr`;
    } else if(minutes > 0){
      // Format: "1:28 min" for minutes
      return `${minutes}:${seconds.toString().padStart(2, '0')} min`;
    } else{
        return `${minutes}:${seconds.toString().padStart(2, '0')} sec`;
    }
  };