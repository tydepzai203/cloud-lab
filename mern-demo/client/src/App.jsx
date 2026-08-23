import { useEffect, useState } from "react";

const API_URL =
  "https://sturdy-waffle-v6wg6x49xg56c6gq-5000.app.github.dev";

function App() {
  // =========================
  // Danh sách sinh viên
  // =========================
  const [students, setStudents] = useState([]);

  // =========================
  // Dữ liệu Form
  // =========================
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // Lấy danh sách sinh viên
  // GET /api/students
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
  // Câu 49 - Thêm sinh viên
  // POST /api/students
  // =========================
  const addStudent = async () => {
    // Kiểm tra dữ liệu nhập
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

      const data = await response.json();

      console.log("Sinh viên vừa thêm:", data);

      // Thông báo thành công
      alert("Thêm sinh viên thành công!");

      // Xóa dữ liệu trong Form
      setStudentId("");
      setName("");
      setEmail("");

      // Tải lại danh sách sinh viên
      getStudents();
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);

      alert("Có lỗi xảy ra khi thêm sinh viên!");
    }
  };

  // =========================
  // Tự động lấy danh sách
  // khi mở trang
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
          FORM THÊM SINH VIÊN
          ========================= */}
      <h2>Thêm sinh viên</h2>

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

      <button onClick={addStudent}>
        Thêm sinh viên
      </button>

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
              <strong>MSSV:</strong> {student.studentId}
              <br />

              <strong>Họ tên:</strong> {student.name}
              <br />

              <strong>Email:</strong> {student.email}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;