import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => {
        console.log('Données des cours reçues:', res.data);
        // Afficher la structure complète du premier cours pour débogage
        if (res.data && res.data.length > 0) {
          console.log('Structure du premier cours:', JSON.stringify(res.data[0], null, 2));
        }
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des cours:', err);
        setError('Erreur lors du chargement des cours');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCourses = courses.filter(course => {
    return searchTerm === '' ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calcul des cours à afficher
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '18px', color: '#666' }}>Chargement des cours...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '18px', color: '#666' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#2c3e50', marginBottom: '10px' }}>Tous les cours</h1>
        <p style={{ color: '#666' }}>Découvrez notre sélection de cours de qualité</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
      </div>

      {filteredCourses.length > 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          {filteredCourses.length} cours trouvés
        </p>
      )}

      {filteredCourses.length > 0 ? (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            margin: '20px 0'
          }}>
            {currentCourses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#2c3e50', lineHeight: '1.3' }}>
                    {course.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '15px',
                    lineHeight: '1.5',
                    minHeight: '60px'
                  }}>
                    {course.description.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#3498db',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px',
                      fontWeight: 'bold'
                    }}>
                      {typeof course.instructor === 'string'
                        ? course.instructor.charAt(0)
                        : (course.instructor?.name?.charAt(0) || '?')}
                    </div>
                    <div>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>
                        {typeof course.instructor === 'string' ? course.instructor : (course.instructor?.name || 'Instructeur')}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {course.instructorTitle || (typeof course.instructor === 'object' ? course.instructor?.title : 'Formateur')}
                        </span>
                        <span style={{ color: '#666' }}>•</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {course.students?.length || 0} {course.students?.length === 1 ? 'étudiant' : 'étudiants'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2980b9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3498db';
                    }}
                  >
                    Voir le cours
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0', gap: '10px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 15px',
                  border: '1px solid #ddd',
                  backgroundColor: 'black',
                  borderRadius: '5px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 15px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === page ? '#3498db' : 'black',
                    color: currentPage === page ? 'white' : 'inherit',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    borderColor: currentPage === page ? '#3498db' : '#ddd'
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 15px',
                  border: '1px solid #ddd',
                  backgroundColor: 'black',
                  borderRadius: '5px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1
                }}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', gridColumn: '1 / -1' }}>
          <p>Aucun cours ne correspond à votre recherche.</p>
          <button
            onClick={() => setSearchTerm('')}
            style={{
              marginTop: '15px',
              padding: '8px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;