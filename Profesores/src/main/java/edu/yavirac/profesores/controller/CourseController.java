package edu.yavirac.profesores.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.crsh.shell.impl.command.system.help;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import edu.yavirac.profesores.model.Course;
import edu.yavirac.profesores.model.Teacher;
import edu.yavirac.profesores.service.CourseService;
import edu.yavirac.profesores.service.TeacherService;
import edu.yavirac.profesores.util.CustomErrorType;

@Controller
@RequestMapping("/v1")

public class CourseController {
	
	@Autowired
	private CourseService _courseService;
	
	@Autowired
	private TeacherService _teacherService;

	// GET
	@RequestMapping(value = "/courses", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<List<Course>> getCourses(@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "id_teacher", required = false) Long id_teacher) {
		List<Course> courses = new ArrayList<Course>();
		if (id_teacher != null) {
			courses = _courseService.findByIdTeacher(id_teacher);
			if (courses.isEmpty()) {
				return new ResponseEntity(HttpStatus.NO_CONTENT);
			}

		}

		if (name != null) {
			Course course = _courseService.findByName(name);
			if (course == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
				// You many decide to return HttpStatus.NOT_FOUND
			}
			courses.add(course);

		}

		if (name == null && id_teacher == null) {
			courses = _courseService.findAllCourses();
			if (courses.isEmpty()) {
				return new ResponseEntity(HttpStatus.NO_CONTENT);
				// You many decide to return HttpStatus.NOT_FOUND
			}

		}

		return new ResponseEntity<List<Course>>(courses, HttpStatus.OK);

	}

	// GET BY ID
	@RequestMapping(value = "/courses/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<Course> getCourseById(@PathVariable("id") Long id) {
		Course course = _courseService.findById(id);
		if (course == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
			// You many decide to return HttpStatus.NOT_FOUND
		}
		return new ResponseEntity<Course>(course, HttpStatus.OK);
	}

	// CREATE
	@RequestMapping(value = "/courses", method = RequestMethod.POST, headers = "Accept=application/json")

	public ResponseEntity<?> createCourse(@RequestBody Course course, UriComponentsBuilder ucBuilder) {
		if (_courseService.findByName(course.getName()) != null) {
			// logger.error("Unable to create. A User with name {} already
			// exist", user.getName());
			return new ResponseEntity(
					new CustomErrorType("Unable to create. A course with name " + course.getName() + " already exist."),
					HttpStatus.CONFLICT);
		}
		_courseService.saveCourse(course);

		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucBuilder.path("/v1/courses/{id}").buildAndExpand(course.getIdCourse()).toUri());
		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
	}

	// UPDATE
	@RequestMapping(value = "/courses/{id}", method = RequestMethod.PATCH)
	public ResponseEntity<?> updateCourses(@PathVariable("id") Long id, @RequestBody Course course) {

		Course currentCourse = _courseService.findById(id);

		if (currentCourse == null) {
			return new ResponseEntity(
					new CustomErrorType("Unable to upate. Social Media with id " + id + " not found."),
					HttpStatus.NOT_FOUND);
		}

		currentCourse.setName(course.getName());
		currentCourse.setThemes(course.getThemes());
		currentCourse.setProject(course.getProject());

		_courseService.updateCourse(currentCourse);
		return new ResponseEntity<Course>(currentCourse, HttpStatus.OK);
	}

	// DELETE
	@RequestMapping(value = "/courses/{id}", method = RequestMethod.DELETE, headers = "Accept=application/json")
	public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) {
		System.out.println("course ID recived: " + id);

		Course course = _courseService.findById(id);
		if (course == null) {
			System.out.println("Unable to delete. course with id not found. " + id);

			return new ResponseEntity(new CustomErrorType("Unable to delete. course with id " + id + " not found."),
					HttpStatus.NOT_FOUND);
		}
		_courseService.deleteCourseById(id);
		return new ResponseEntity<Course>(HttpStatus.NO_CONTENT);
	}

	// CREATE COURSE ICON
	public static final String COURSE_UPLOADED_FOLDER = "images/courses/";

	@RequestMapping(value = "/courses/icons", method = RequestMethod.POST, headers = ("content-type=multipart/form-data"))
	public ResponseEntity<byte[]> uploadTeacherImage(@RequestParam("id_course") Long idCourse,
			@RequestParam("icon") MultipartFile multipartFile, UriComponentsBuilder componentsBuilder) {
		if (idCourse == null) {
			return new ResponseEntity(new CustomErrorType("Please set id_course"), HttpStatus.NO_CONTENT);
		}

		if (multipartFile.isEmpty()) {
			return new ResponseEntity(new CustomErrorType("Please select a file to upload"), HttpStatus.NO_CONTENT);
		}

		Course course = _courseService.findById(idCourse);
		if (course == null) {
			return new ResponseEntity(new CustomErrorType("Teacher with id_teacher: " + idCourse + " not found"),
					HttpStatus.NOT_FOUND);
		}

		if (!course.getIcon().isEmpty() || course.getIcon() != null) {
			String fileName = course.getIcon();
			Path path = Paths.get(fileName);
			File f = path.toFile();
			if (f.exists()) {
				f.delete();
			}
		}

		try {
			Date date = new Date();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
			String dateName = dateFormat.format(date);

			String fileName = String.valueOf(idCourse) + "-iconOfCourse-" + dateName + "."
					+ multipartFile.getContentType().split("/")[1];
			
			course.setIcon(COURSE_UPLOADED_FOLDER + fileName);
			byte[] bytes = multipartFile.getBytes();
			Path path = Paths.get(COURSE_UPLOADED_FOLDER + fileName);
			Files.write(path, bytes);

			_courseService.updateCourse(course);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(bytes);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new ResponseEntity(
					new CustomErrorType("Error during upload: " + multipartFile.getOriginalFilename()),
					HttpStatus.CONFLICT);
		}
	}
	
	//GET COURSE ICON

	@RequestMapping(value = "/course/{id_course}/icons", method = RequestMethod.GET)
	public ResponseEntity<byte[]> getTeacherImage(@PathVariable("id_course") Long idCourse) {
		if (idCourse == null) {
			return new ResponseEntity(new CustomErrorType("Please set id_teacher "), HttpStatus.NO_CONTENT);
		}

		Course course = _courseService.findById(idCourse);
		if (course == null) {
			return new ResponseEntity(new CustomErrorType("Teacher with id_teacher: " + idCourse + " not found"),
					HttpStatus.NOT_FOUND);
		}

		try {

			String fileName = course.getIcon();
			Path path = Paths.get(fileName);
			File f = path.toFile();
			if (!f.exists()) {
				return new ResponseEntity(false, HttpStatus.CONFLICT);
			}

			byte[] image = Files.readAllBytes(path);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new ResponseEntity(new CustomErrorType("Error to show image"), HttpStatus.CONFLICT);
		}

	}
	
	//ASSIGN TEACHER TO COURSE
		@RequestMapping(value="/courses/teachers", method = RequestMethod.PUT, headers="Accept=application/json")
		public ResponseEntity<Course> assignTeacherToCourse(@RequestBody Course course, UriComponentsBuilder ucBuilder){
			System.out.println(course);
			if (course.getIdCourse() == null || course.getTeacher().getIdTeacher() == null) {
				return new ResponseEntity(new CustomErrorType("We need almost id_course and id_teacher "),HttpStatus.CONFLICT);
			}
			Course courseSaved = _courseService.findById(course.getIdCourse());
			if (courseSaved == null) {
				return new ResponseEntity(new CustomErrorType("The id_course: " + course.getIdCourse() + " not found."),HttpStatus.CONFLICT);
			}
			Teacher teacher = _teacherService.findById(course.getTeacher().getIdTeacher());
			if (teacher == null) {
				return new ResponseEntity(new CustomErrorType("The id_teacher: " + course.getTeacher().getIdTeacher() + " not found."),HttpStatus.CONFLICT);
			}
			courseSaved.setTeacher(teacher);
			_courseService.updateCourse(courseSaved);

			return new ResponseEntity<Course>(courseSaved, HttpStatus.OK);
		}

}
