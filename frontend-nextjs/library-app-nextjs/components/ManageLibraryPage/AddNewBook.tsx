"use client";
import React, { useState } from "react";
import { AddBookRequest } from "@/models/AddBookRequest";
import { getToken } from "@/lib/localAuth";
import { API_CONFIG } from "@/config/apiConfig";

export default function AddNewBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  async function base64ConversionForImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }

  async function submitNewBook() {
    setDisplayWarning(false);
    setDisplaySuccess(false);

    if (
      title.trim() === "" ||
      author.trim() === "" ||
      category === "Category" ||
      description.trim() === "" ||
      copies <= 0 ||
      !selectedImage
    ) {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      return;
    }

    try {
      const API_BOOK = API_CONFIG.BOOK_SERVICE;
      const url = `${API_BOOK}/books/internal`;

      const book = {
        title,
        author,
        description,
        copies,
        category,
        img: selectedImage,
      };

      console.log("============ ADD NEW BOOK DEBUG ============");
      console.log("API_BOOK:", API_BOOK);
      console.log("URL:", url);
      console.log("Payload:", book);

      // Lấy token chuẩn
      const token = getToken();
      console.log("Token FE gửi lên Authorization:", token);
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(book),
        credentials: "include"
      });

      console.log("Response from backend:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error body:", errorText);
        throw new Error(errorText || "Add book failed");
      }
      setTitle("");
      setAuthor("");
      setDescription("");
      setCopies(0);
      setCategory("Category");
      setSelectedImage(null);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } catch (error: any) {
      console.error(error);
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Book added successfully
        </div>
      )}
      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          All fields must be filled out
        </div>
      )}
      <div className="card">
        <div className="card-header">Add a new book</div>
        <div className="card-body">
          <form method="POST" onSubmit={e => { e.preventDefault(); submitNewBook(); }}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <button
                  className="form-control btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  tabIndex={-1}
                >
                  {category}
                </button>
                <ul
                  id="addNewBookId"
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a onClick={() => categoryField("FE")} className="dropdown-item" style={{ cursor: "pointer" }}>
                      Front End
                    </a>
                  </li>
                  <li>
                    <a onClick={() => categoryField("BE")} className="dropdown-item" style={{ cursor: "pointer" }}>
                      Back End
                    </a>
                  </li>
                  <li>
                    <a onClick={() => categoryField("Data")} className="dropdown-item" style={{ cursor: "pointer" }}>
                      Data
                    </a>
                  </li>
                  <li>
                    <a onClick={() => categoryField("DevOps")} className="dropdown-item" style={{ cursor: "pointer" }}>
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Copies</label>
              <input
                type="number"
                className="form-control"
                name="Copies"
                required
                onChange={(e) => setCopies(Number(e.target.value))}
                value={copies}
              />
            </div>
            <input type="file" onChange={base64ConversionForImages} />
            <div>
              <button
                type="submit"
                className="btn btn-primary mt-3"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}