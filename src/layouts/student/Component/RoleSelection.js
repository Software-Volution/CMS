import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();
  
    const handleRoleChange = (event) => {
      setRole(event.target.value);
    };
  
    const handleSubmit = () => {
      if (role === 'admin') {
        navigate('/admin-signup');
      } else if (role === 'student') {
        navigate('/student-signup');
      } else if (role === 'artisan') {
        navigate('/artisan-signup');
      }
    };
  
    return (
      <div>
        <form>
          <div>
            <label>
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={handleRoleChange}
              />
              Admin
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={handleRoleChange}
              />
              Student
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                value="artisan"
                checked={role === 'artisan'}
                onChange={handleRoleChange}
              />
              Artisan
            </label>
          </div>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  };
  
  export default RoleSelection;