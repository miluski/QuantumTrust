package com.quantum.trust.backend.annotations;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.hibernate.annotations.IdGeneratorType;

import com.quantum.trust.backend.utils.CardNumberGenerator;

/**
 * Annotation to indicate that the annotated field or method should have a 
 * generated card ID. The card ID is generated using the specified 
 * {@link CardNumberGenerator} class.
 * 
 * <p>This annotation should be used on fields or methods where a unique card 
 * ID is required. The {@link IdGeneratorType} specifies the generator class 
 * to be used for generating the card ID.</p>
 * 
 * <p>Usage example:</p>
 * <pre>
 * {@code
 * @CardId
 * private String cardId;
 * }
 * </pre>
 * 
 * @see CardNumberGenerator
 * @see IdGeneratorType
 * @see Retention
 * @see Target
 */
@IdGeneratorType(CardNumberGenerator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ FIELD, METHOD })
public @interface CardId {
}
