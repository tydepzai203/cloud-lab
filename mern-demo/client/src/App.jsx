import { useEffect, useState } from "react";

const API_URL =
  "http://localhost:5000";

function App() {
  // =========================
  // Danh sách sinh viên
  // =========================
  const [students, setStudents] = useState([]);

  // =========================
  // Form
  // =========================
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ID sinh viên đang sửa
  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET - Lấy danh sách
  // =========================
  const getStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
    }
  };

  // =========================
  // POST - Thêm sinh viên
  // =========================
  const addStudent = async () => {
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ MSSV, Họ tên và Email!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          studentId: studentId,
          name: name,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm sinh viên");
      }

      await response.json();

      alert("Thêm sinh viên thành công!");

      setStudentId("");
      setName("");
      setEmail("");

      getStudents();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);

      alert("Có lỗi xảy ra khi thêm sinh viên!");
    }
  };

  // =========================
  // PUT - Cập nhật sinh viên
  // =========================
  const updateStudent = async () => {
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/students/${editingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            studentId: studentId,
            name: name,
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật sinh viên");
      }

      await response.json();

      alert("Cập nhật sinh viên thành công!");

      setStudentId("");
      setName("");
      setEmail("");

      setEditingId(null);

      getStudents();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);

      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  // =========================
  // Chọn sinh viên để sửa
  // =========================
  const editStudent = (student) => {
    setEditingId(student._id);

    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // =========================
  // Hủy sửa
  // =========================
  const cancelEdit = () => {
    setEditingId(null);

    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // Câu 62 - DELETE
  // Xóa sinh viên
  // =========================
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa sinh viên");
      }

      const data = await response.json();

      console.log("Kết quả xóa:", data);

      alert("Xóa sinh viên thành công!");

      // Nếu đang sửa sinh viên vừa bị xóa
      if (editingId === id) {
        cancelEdit();
      }

      // Tải lại danh sách
      getStudents();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);

      alert("Có lỗi xảy ra khi xóa sinh viên!");
    }
  };

  // =========================
  // Load danh sách khi mở trang
  // =========================
  useEffect(() => {
    getStudents();
  }, []);

  // =========================
  // Giao diện
  // =========================
  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      {/* =========================
          FORM
          ========================= */}
      <h2>
        {editingId
          ? "Cập nhật sinh viên"
          : "Thêm sinh viên"}
      </h2>

      <input
        type="text"
        placeholder="MSSV"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      {/* =========================
          NÚT THÊM
          ========================= */}
      {!editingId && (
        <button onClick={addStudent}>
          Thêm sinh viên
        </button>
      )}

      {/* =========================
          NÚT CẬP NHẬT
          ========================= */}
      {editingId && (
        <>
          <button onClick={updateStudent}>
            Cập nhật
          </button>

          {" "}

          <button onClick={cancelEdit}>
            Hủy
          </button>
        </>
      )}

      {/* =========================
          DANH SÁCH SINH VIÊN
          ========================= */}
      <h2>Danh sách sinh viên</h2>

      {students.length === 0 ? (
        <p>Không có sinh viên.</p>
      ) : (
        students.map((student) => (
          <div key={student._id}>
            <p>
              <strong>MSSV:</strong>{" "}
              {student.studentId}
              <br />

              <strong>Họ tên:</strong>{" "}
              {student.name}
              <br />

              <strong>Email:</strong>{" "}
              {student.email}
            </p>

            {/* Nút Sửa */}
            <button
              onClick={() => editStudent(student)}
            >
              Sửa
            </button>

            {" "}

            {/* Nút Xóa */}
            <button
              onClick={() =>
                deleteStudent(student._id)
              }
            >
              Xóa
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;