package edu.yavirac.profesores.service;

import java.util.List;

import edu.yavirac.profesores.model.Teacher;

public interface TeacherService {
void saveTeacher(Teacher teacher);
	
	void deleteTeacherById(Long idTeacher);
	
	void updateTeacher(Teacher teacher);
	
	List<Teacher> findAllTeachers();
	
	Teacher findById(Long idTeacher);
	
	Teacher findByName(String name);
}
