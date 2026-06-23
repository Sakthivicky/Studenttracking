export default function AddStudentPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Add Student
      </h1>

      <div className="grid gap-4">

        <input
          type="text"
          placeholder="Student Name"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Year"
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Arrears"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Specialization"
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="City"
          className="border p-3 rounded-lg"
        />

        <select className="border p-3 rounded-lg">
          <option>Hostel</option>
          <option>Day Scholar</option>
        </select>

        <input
          type="text"
          placeholder="Room Number"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Preferred Location"
          className="border p-3 rounded-lg"
        />

        <textarea
          placeholder="Comments"
          className="border p-3 rounded-lg"
        />

        <button className="bg-blue-600 text-white p-3 rounded-lg">
          Save Student
        </button>

      </div>
    </div>
  );
}