package edu.yavirac.profesores.service;

import java.util.List;

import edu.yavirac.profesores.model.Course;

public interface CourseService {
	/**
	 * Este metodo Guarda el Curso
	 * 
	 * @param course es un objeto {@code Course} con todos los datos del curso
	 * 
	 */

	void saveCourse(Course course);

	/**
	 * Este metodo Elimina el Curso

	 * @param idCourse es un objeto {@code Long} con todos los datos del curso
	 */

	void deleteCourseById(Long idCourse);

	/**
	 * Este metodo Actualiza el Curso
	 * 
	 * @param course es un objeto {@code Course} con todos los datos del curso
	 */

	void updateCourse(Course course);

	/**
	 * Este metodo devuelve todos los cursos
	 * 
	 */
	List<Course> findAllCourses();

	/**
	 * Este metodo Busca el Curso por el ID
	 * 
	 * @param idCourse es un id {@code Long} con el id del Curso
	 * 
	 */
	Course findById(Long idCourse);

	/**
	 * Este metodo Busca el Curso por el nombre.
	 * @param name es un id {@code String} con el id del Curso
	 * 
	 */

	Course findByName(String name);

	/**
	 * Este metodo Busca el Curso por el id del Teacher
	 * @param idTeacher es un id {@code Long} con el id del Teacher
	 * 
	 */

	List<Course> findByIdTeacher(Long idTeacher);

}
