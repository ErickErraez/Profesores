package edu.yavirac.profesores.service;

import java.util.List;

import edu.yavirac.profesores.model.Teacher;

public interface TeacherService {

	/**
	 * Este metodo Guarda al Teacher
	 * @param teacher es un objeto {@code Teacher} con todos los datos del teacher
	 * 
	 * 
	 */
	void saveTeacher(Teacher teacher);

	/**
	 * Este metodo Elimina al Teacher por el id
	 * @param idTeacher es un id {@code Long} perteneciente al teacher.
	 * 
	 * 
	 */
	void deleteTeacherById(Long idTeacher);

	/**
	 * Este metodo Actualiza al Teacher
	 * @param teacher es un objeto {@code Teacher} con todos los datos del teacher
	 * 
	 * 
	 */

	void updateTeacher(Teacher teacher);

	/**
	 * Este metodo devuelve a todos los profesores existentes
	 * 
	 */

	List<Teacher> findAllTeachers();

	/**
	 * Este metodo Busca al Teacher atravez del id
	 * @param idTeacher es un id {@code Teacher}  perteneciente al teacher.
	 * 
	 * 
	 */
	Teacher findById(Long idTeacher);

	/**
	 * Este metodo Busca al Teacher atravez del nombre
	 * @param name es un nombre {@code String} que corresponde al nombre del teacher
	 * 
	 */

	Teacher findByName(String name);

}
