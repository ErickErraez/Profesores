package edu.yavirac.profesores;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 * <h1>Catalgo de Profesores</h1> Es un Rest Api que permite guardar datos, imagenes y 
 * tambien permite enviar los datos a cualquier FrontEnd.
 * <p>
 * 
 * @author Erick Erraezz
 * @version 1.1
 * @since 2018
 * 
 */
@SpringBootApplication
public class ProfesoresApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProfesoresApplication.class, args);
	}
}
