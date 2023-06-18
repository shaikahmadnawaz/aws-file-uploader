import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadedFileUrl(response.data.fileUrl);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const handleDownload = () => {
    if (uploadedFileUrl) {
      window.open(uploadedFileUrl, "_blank");
    }
  };

  return (
    <div className="mx-auto flex flex-col justify-center items-center mt-8">
      <h1 className="text-3xl font-bold mb-4">File Upload & Download</h1>
      <div className="flex flex-col items-start space-y-4">
        <label htmlFor="fileInput" className="font-semibold">
          Select a file:
        </label>
        <input
          type="file"
          id="fileInput"
          className="border border-gray-300 rounded p-2"
          onChange={handleFileChange}
        />
        <button
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            !selectedFile ? "cursor-not-allowed" : ""
          }`}
          disabled={!selectedFile}
          onClick={handleUpload}
        >
          Upload
        </button>
        {uploadedFileUrl && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">File uploaded!</span>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
