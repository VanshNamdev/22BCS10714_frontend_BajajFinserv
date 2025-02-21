import React, { useState } from "react";

const App = () => {
    const [jsonInput, setJsonInput] = useState(""); // Store user-entered JSON
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [selectedFilters, setSelectedFilters] = useState([]); // Store selected filter options
    const [operationCode, setOperationCode] = useState(null); // Store GET API response

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(jsonInput); // Ensure input is valid JSON
            console.log("🔹 Sending Data to API:", parsedData);

            const res = await fetch("https://two2bcs10714-bajajfinserv.onrender.com", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData),
            });

            console.log("🔹 Response Status:", res.status);
            const result = await res.json();
            console.log("🔹 API Response:", result);

            setResponse(result);
            setError("");
        } catch (err) {
            setError("Invalid JSON or API error");
            console.error("❌ Error:", err);
        }
    };

    const handleGetRequest = async () => {
        try {
            console.log("🔹 Calling GET API...");

            const res = await fetch("https://two2bcs10714-bajajfinserv.onrender.com", {
                method: "GET",
            });

            console.log("🔹 GET Response Status:", res.status);
            const result = await res.json();
            console.log("🔹 GET API Response:", result);

            setOperationCode(result.operation_code);
            setError("");
        } catch (err) {
            setError("GET API Error");
            console.error("❌ GET API Error:", err);
        }
    };

    const handleFilterChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedFilters([...selectedFilters, value]);
        } else {
            setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
        }
    };

    // Function to filter response and display it as a plain string
    const getFilteredResponse = () => {
        if (!response) return "";

        let filteredText = [];

        if (selectedFilters.includes("Numbers") && response.numbers.length > 0) {
            filteredText.push(`Numbers: ${response.numbers.join(", ")}`);
        }
        if (selectedFilters.includes("Alphabets") && response.alphabets.length > 0) {
            filteredText.push(`Alphabets: ${response.alphabets.join(", ")}`);
        }
        if (selectedFilters.includes("Highest Alphabet") && response.highest_alphabet.length > 0) {
            filteredText.push(`Highest Alphabet: ${response.highest_alphabet.join(", ")}`);
        }

        return filteredText.join(" | "); // Separate different categories with " | "
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
            <h2>Bajaj Finserv Health Dev Challenge</h2>
            
            <textarea
                rows="6"
                cols="50"
                placeholder='Enter JSON: {"data": ["A", "C", "Z", "1", "3"]}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
            />
            <br />
            <button onClick={handleSubmit}>Submit POST Request</button>

            <br /><br />
            <button onClick={handleGetRequest}>Call GET API</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {operationCode !== null && (
                <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
                    <h4>GET API Response:</h4>
                    <p>Operation Code: <strong>{operationCode}</strong></p>
                </div>
            )}

            {response && (
                <div style={{ marginTop: "20px", textAlign: "left", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "5px" }}>
                    <h4>Filter Response:</h4>
                    <label>
                        <input type="checkbox" value="Numbers" onChange={handleFilterChange} />
                        Numbers
                    </label>
                    <label>
                        <input type="checkbox" value="Alphabets" onChange={handleFilterChange} />
                        Alphabets
                    </label>
                    <label>
                        <input type="checkbox" value="Highest Alphabet" onChange={handleFilterChange} />
                        Highest Alphabet
                    </label>

                    <h4>Filtered Response:</h4>
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>{getFilteredResponse() || "Select a filter to view results"}</p>
                </div>
            )}
        </div>
    );
};

export default App;
