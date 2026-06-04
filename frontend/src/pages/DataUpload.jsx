import { useState } from "react";

function DataUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Chọn file CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:8000/api/upload-sales",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log(data);

      setMessage(
        JSON.stringify(data)
      );
    } catch (err) {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="page-container">
      <h1>Upload Sales Data</h1>

      <input
        type="file"
        accept=".csv"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload
      </button>

      <p>{message}</p>
    </div>
  );
}

export default DataUpload;