package edu.yavirac.profesores.service;

import java.util.List;

import edu.yavirac.profesores.model.SocialMedia;
import edu.yavirac.profesores.model.TeacherSocialMedia;

public interface SocialMediaService {

	/**
	 * Este metodo Guarda la SocialMedia
	 * @param socialMedia es un objeto {@code SocialMedia } que trae todos los datos del objeto
	 */
	void saveSocialMedia(SocialMedia socialMedia);

	/**
	 * Este metodo Elimina la SocialMedia
	 * 
	 * @param id es un id {@code Long } que pertenece al id a eliminar
	 * 
	 */
	void deleteSocialMediaById(Long id);

	/**
	 * Este metodo Actualiza la SocialMedia
	 * @param socialMedia es un objeto {@code SocialMedia} que trae todos los datos del objeto
	 * 
	 * 
	 */
	void updateSocialMedia(SocialMedia socialMedia);

	/**
	 * Este metodo devuelve todos las SocialMedia
	 * 
	 * 
	 */

	List<SocialMedia> findAllSocialMedias();

	/**
	 * Este metodo Busca la SocialMedia por el id
	 * 
	 * 
	 * @param idSocialMedia es un idSocialMedia {@code Long} que pertenece al id a eliminar
	 * 
	 */

	SocialMedia findById(Long idSocialMedia);

	/**
	 * Este metodo Busca la SocialMedia por el nombre
	 * 
	 * @param name id es un nombre {@code String} que pertenece a la redSocial a Buscar
	 * 
	 */

	SocialMedia findByName(String name);

	/**
	 * Este metodo Busca la SocialMedia por el nickname y el id
	 * 
	 */
	TeacherSocialMedia findSocialMediaByIdAndName(Long idSocialMedia, String nickname);

	/**
	 * Este metodo Busca la SocialMedia por el id del profesor y el id de la
	 * socialmedia
	 * 
	 */
	TeacherSocialMedia findSocialMediaByIdTeacherAndIdSocialMedia(Long idTeacher, Long idSocialMedia);
}
