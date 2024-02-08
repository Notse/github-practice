// Function to read the file and analyze the data
function analyzeFile(file) {
  const reader = new FileReader();
  console.log(reader);
  // Event listener for when the file is loaded
  reader.onload = function (event) {
    const fileData = event.target.result;
    console.log(fileData);
    // Assuming the file contains data in a specific format (e.g., CSV)
    // Assumptions: Each line represents an employee's record with fields separated by commas
    const lines = fileData.split(",");

    // Initialize variables to store analyzed data
    const sevenConsecutiveDays = [];
    const lessThan10HoursBetweenShifts = [];
    const moreThan14HoursInAShift = [];

    lines.forEach((line, index) => {
      const fields = line.split(",");

      // Assuming the data format: name, position, start time, end time

      // Extract relevant information
      const name = fields[0];
      const position = fields[1];
      const startTime = new Date(fields[2]);
      const endTime = new Date(fields[3]);

      // a) Check for 7 consecutive days
      if (checkConsecutiveDays(lines, index, 7)) {
        sevenConsecutiveDays.push({ name, position });
      }

      // b) Check for less than 10 hours between shifts but greater than 1 hour
      if (index > 0) {
        const prevEndTime = new Date(lines[index - 1].split(",")[3]);
        const hoursBetweenShifts = (startTime - prevEndTime) / (1000 * 60 * 60);
        if (hoursBetweenShifts > 1 && hoursBetweenShifts < 10) {
          lessThan10HoursBetweenShifts.push({ name, position });
        }
      }

      // c) Check for more than 14 hours in a single shift
      const hoursInAShift = (endTime - startTime) / (1000 * 60 * 60);
      if (hoursInAShift > 14) {
        moreThan14HoursInAShift.push({ name, position });
      }
    });

    function checkConsecutiveDays(lines, currentIndex, consecutiveDays) {
      const currentDate = new Date(lines[currentIndex].split(",")[2]);

      for (let i = 1; i < consecutiveDays; i++) {
        const prevDate = new Date(lines[currentIndex - i].split(",")[2]);
        const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

        if (dayDiff !== 1) {
          return false;
        }
      }

      return true;
    }

    // Print the results to the console
    console.log(
      "Employees who have worked for 7 consecutive days:",
      sevenConsecutiveDays
    );
    console.log(
      "Employees with less than 10 hours between shifts but greater than 1 hour:",
      lessThan10HoursBetweenShifts
    );
    console.log(
      "Employees who have worked for more than 14 hours in a single shift:",
      moreThan14HoursInAShift
    );
  };

  // Event listener for errors during file reading
  reader.onerror = function (event) {
    console.error("Error reading the file:", event.target.error);
  };

  // Read the file as text
  reader.readAsText(file);
}

// Example usage (assuming you have an input element with type="file" in your HTML)
const fileInput = document.getElementById("fileInput"); // Replace with your actual input element
fileInput.addEventListener("change", function () {
  const selectedFile = this.files[0];
  analyzeFile(selectedFile);
});
