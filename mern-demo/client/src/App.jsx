import { useEffect, useState } from "react";
import './App.css'; // Import file CSS làm đẹp vào đây

const API_URL =
  "http://localhost:5000";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  const getStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      if (!response.ok) throw new Error("Không thể lấy danh sách sinh viên");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách:", error);
    }
  };

  const addStudent = async () => {
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ MSSV, Họ tên và Email!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentId, name: name, email: email }),
      });
      if (!response.ok) throw new Error("Không thể thêm sinh viên");
      await response.json();
      alert("Thêm sinh viên thành công!");
      setStudentId(""); setName(""); setEmail("");
      getStudents();
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      alert("Có lỗi xảy ra khi thêm sinh viên!");
    }
  };

  const updateStudent = async () => {
    if (!studentId || !name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/students/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentId, name: name, email: email }),
      });
      if (!response.ok) throw new Error("Không thể cập nhật sinh viên");
      await response.json();
      alert("Cập nhật sinh viên thành công!");
      setStudentId(""); setName(""); setEmail(""); setEditingId(null);
      getStudents();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa sinh viên");
      await response.json();
      alert("Xóa sinh viên thành công!");
      if (editingId === id) cancelEdit();
      getStudents();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Có lỗi xảy ra khi xóa sinh viên!");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="container">
      <h1>Quản lý sinh viên - phiên Bản 2.0 </h1>

      <h2>{editingId ? "Cập nhật thông tin" : "Thêm sinh viên mới"}</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Nhập MSSV..."
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nhập Họ tên..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Nhập Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="btn-group">
        {!editingId ? (
          <button className="btn-add" onClick={addStudent}>
            Thêm sinh viên
          </button>
        ) : (
          <>
            <button className="btn-update" onClick={updateStudent}>
              Cập nhật
            </button>
            <button className="btn-cancel" onClick={cancelEdit}>
              Hủy
            </button>
          </>
        )}
      </div>

      <h2 style={{ marginTop: '40px' }}>Danh sách sinh viên</h2>

      <div className="student-list">
        {students.length === 0 ? (
          <p className="empty-msg">Chưa có dữ liệu sinh viên nào.</p>
        ) : (
          students.map((student) => (
            <div className="student-card" key={student._id}>
              <div className="student-info">
                <p><strong>MSSV:</strong> {student.studentId}</p>
                <p><strong>Họ tên:</strong> {student.name}</p>
                <p><strong>Email:</strong> {student.email}</p>
              </div>
              
              <div className="student-actions">
                <button className="btn-edit" onClick={() => editStudent(student)}>
                  Sửa
                </button>
                <button className="btn-delete" onClick={() => deleteStudent(student._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;