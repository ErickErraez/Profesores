package edu.yavirac.profesores.controller;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import edu.yavirac.profesores.model.SocialMedia;
import edu.yavirac.profesores.model.Teacher;
import edu.yavirac.profesores.service.SocialMediaService;
import edu.yavirac.profesores.util.CustomErrorType;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/v1")
public class SocialMediaController {

	@Autowired
	SocialMediaService _socialMediaService;

	// GET ALL OR NAME
	@RequestMapping(value = "/socialMedias", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<List<SocialMedia>> getSocialMedias(
			@RequestParam(value = "name", required = false) String name) {

		List<SocialMedia> socialMedias = new ArrayList<>();

		if (name == null) {

			socialMedias = _socialMediaService.findAllSocialMedias();
			if (socialMedias.isEmpty()) {
				return new ResponseEntity(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<List<SocialMedia>>(socialMedias, HttpStatus.OK);
		} // end if
		else {
			SocialMedia socialMedia = _socialMediaService.findByName(name);
			if (socialMedia == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}

			socialMedias.add(socialMedia);
			return new ResponseEntity<List<SocialMedia>>(socialMedias, HttpStatus.OK);
		}

	}

	// GET BY ID
	@RequestMapping(value = "/socialMedias/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
	public ResponseEntity<SocialMedia> getSocialMediaById(@PathVariable("id") Long idSocialMedia) {

		if (idSocialMedia == null || idSocialMedia <= 0) {
			return new ResponseEntity(new CustomErrorType("idSocialMedia is required"), HttpStatus.CONFLICT);
		}

		SocialMedia socialMedia = _socialMediaService.findById(idSocialMedia);
		if (socialMedia == null) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);

		}

		return new ResponseEntity<SocialMedia>(socialMedia, HttpStatus.OK);
	}

	// POST
	@RequestMapping(value = "/socialMedias", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<?> createSocialMedia(@RequestBody SocialMedia socialMedia,
			UriComponentsBuilder uriComponentsBuilder) {

		if (socialMedia.getName().equals(null) || socialMedia.getName().isEmpty()) {
			return new ResponseEntity(new CustomErrorType("SocialMedia name is required"), HttpStatus.CONFLICT);
		}
		if (_socialMediaService.findByName(socialMedia.getName()) != null) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);
		}

		_socialMediaService.saveSocialMedia(socialMedia);
		SocialMedia socialMedia2 = _socialMediaService.findByName(socialMedia.getName());
		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(uriComponentsBuilder.path("/v1/socialMedias/{id}")
				.buildAndExpand(socialMedia2.getIdSocialMedia()).toUri());

		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
	}

	// UPDATE
	@RequestMapping(value = "/socialMedias/{id}", method = RequestMethod.PATCH, headers = "Accept=application/json")
	public ResponseEntity<SocialMedia> updateSocialMedia(@PathVariable("id") Long idSocialMedia,
			@RequestBody SocialMedia socialMedia) {

		if (idSocialMedia == null || idSocialMedia <= 0) {
			return new ResponseEntity(new CustomErrorType("idSocialMedia is required"), HttpStatus.CONFLICT);
		}

		SocialMedia currentSocialMedia = _socialMediaService.findById(idSocialMedia);
		if (currentSocialMedia == null) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);
		}

		if (socialMedia.getName().equals(null) || socialMedia.getName().isEmpty() || socialMedia.getIcon().equals(null)
				|| socialMedia.getIcon().isEmpty()) {
			return new ResponseEntity(new CustomErrorType("Error missing fields"), HttpStatus.CONFLICT);
		}

		currentSocialMedia.setName(socialMedia.getName());
		currentSocialMedia.setIcon(socialMedia.getIcon());

		_socialMediaService.updateSocialMedia(currentSocialMedia);
		return new ResponseEntity<SocialMedia>(currentSocialMedia, HttpStatus.OK);
	}

	// DELETE
	@RequestMapping(value = "/socialMedias/{id}", method = RequestMethod.DELETE)

	public ResponseEntity<?> deleteSocialMedia(@PathVariable("id") Long idSocialMedia) {

		if (idSocialMedia == null || idSocialMedia <= 0) {

			return new ResponseEntity(new CustomErrorType("idSocialMedia is required"), HttpStatus.CONFLICT);
		}

		SocialMedia socialMedia = _socialMediaService.findById(idSocialMedia);

		if (socialMedia == null) {

			return new ResponseEntity(HttpStatus.NO_CONTENT);
		}

		_socialMediaService.deleteSocialMediaById(idSocialMedia);

		return new ResponseEntity<SocialMedia>(HttpStatus.OK);
	}

	public static final String SOCIALMEDIA_UPLOADED_FOLDER = "images/socialMedias/";

	// CREATE TEACHER IMAGE
	@RequestMapping(value = "/socialMedias/images", method = RequestMethod.POST, headers = ("content-type=multipart/form-data"))
	public ResponseEntity<byte[]> uploadTeacherImage(@RequestParam("id_social_media") Long idSocialMedia,
			@RequestParam("icon") MultipartFile multipartFile, UriComponentsBuilder componentsBuilder) {
		if (idSocialMedia == null) {
			return new ResponseEntity(new CustomErrorType("Please set idSocialMedia"), HttpStatus.NO_CONTENT);
		}

		if (multipartFile.isEmpty()) {
			return new ResponseEntity(new CustomErrorType("Please select a file to upload"), HttpStatus.NO_CONTENT);
		}

		SocialMedia socialMedia = _socialMediaService.findById(idSocialMedia);
		if (socialMedia == null) {
			return new ResponseEntity(new CustomErrorType("Teacher with id_teacher: " + idSocialMedia + " not found"),
					HttpStatus.NOT_FOUND);
		}

		if (!socialMedia.getIcon().isEmpty() || socialMedia.getIcon() != null) {
			String fileName = socialMedia.getIcon();
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

			String fileName = String.valueOf(idSocialMedia) + "-icon-" + dateName + "."
					+ multipartFile.getContentType().split("/")[1];
			socialMedia.setIcon(SOCIALMEDIA_UPLOADED_FOLDER + fileName);

			byte[] bytes = multipartFile.getBytes();
			Path path = Paths.get(SOCIALMEDIA_UPLOADED_FOLDER + fileName);
			Files.write(path, bytes);

			_socialMediaService.updateSocialMedia(socialMedia);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(bytes);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return new ResponseEntity(
					new CustomErrorType("Error during upload: " + multipartFile.getOriginalFilename()),
					HttpStatus.CONFLICT);
		}
	}

	// GET IMAGE
	@RequestMapping(value = "/socialMedias/{id_social_media}/images", method = RequestMethod.GET)
	public ResponseEntity<byte[]> getTeacherImage(@PathVariable("id_social_media") Long idSocialMedia) {
		if (idSocialMedia == null) {
			return new ResponseEntity(new CustomErrorType("Please set id_social_media "), HttpStatus.NO_CONTENT);
		}

		SocialMedia socialMedia = _socialMediaService.findById(idSocialMedia);
		if (socialMedia == null) {
			return new ResponseEntity(
					new CustomErrorType("SocialMedia with id_social_media: " + idSocialMedia + " not found"),
					HttpStatus.NOT_FOUND);
		}

		try {

			String fileName = socialMedia.getIcon();
			Path path = Paths.get(fileName);
			File f = path.toFile();
			if (!f.exists()) {
				return new ResponseEntity(new CustomErrorType("Image not found"), HttpStatus.CONFLICT);
			}

			byte[] image = Files.readAllBytes(path);
			return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);

		} catch (Exception e) {

			e.printStackTrace();
			return new ResponseEntity(new CustomErrorType("Error to show image"), HttpStatus.CONFLICT);
		}

	}

	// DELETE PICTURE
	@RequestMapping(value = "/socialMedias/{id_social_media}/picture", method = RequestMethod.DELETE, headers = "Accept=application/json")
	public ResponseEntity<?> deleteTeacherImage(@PathVariable("id_social_media") Long idSocialMedia) {
		if (idSocialMedia == null) {
			return new ResponseEntity(new CustomErrorType("Please set id_social_media "), HttpStatus.NO_CONTENT);
		}

		SocialMedia socialMedia = _socialMediaService.findById(idSocialMedia);
		if (socialMedia == null) {
			return new ResponseEntity(
					new CustomErrorType("Social Media with id_social_media: " + idSocialMedia + " not found"),
					HttpStatus.NOT_FOUND);
		}

		if (socialMedia.getIcon().isEmpty() || socialMedia.getIcon() == null) {
			return new ResponseEntity(new CustomErrorType("These teacher doesn't have image asigned"),
					HttpStatus.NO_CONTENT);
		}

		String fileName = socialMedia.getIcon();
		Path path = Paths.get(fileName);
		File file = path.toFile();

		if (file.exists()) {

			file.delete();
		}

		socialMedia.setIcon("");
		_socialMediaService.updateSocialMedia(socialMedia);
		return new ResponseEntity<Teacher>(HttpStatus.NO_CONTENT);
	}

}
