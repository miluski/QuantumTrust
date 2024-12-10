package com.quantum.trust.backend.annotations;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.hibernate.annotations.IdGeneratorType;

import com.quantum.trust.backend.utils.PolishAccountNumberGenerator;

/**
 * Annotation to indicate that the annotated field or method should have an IBAN (International Bank Account Number) ID.
 * The IBAN ID is generated using the specified {@link PolishAccountNumberGenerator} class.
 * 
 * <p>This annotation can be applied to fields and methods.</p>
 * 
 * <p>Usage example:</p>
 * <pre>
 * {@code
 * @IbanId
 * private String iban;
 * }
 * </pre>
 * 
 * @see PolishAccountNumberGenerator
 */
@IdGeneratorType(PolishAccountNumberGenerator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ FIELD, METHOD })
public @interface IbanId {
}
