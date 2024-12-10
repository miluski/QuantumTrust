package com.quantum.trust.backend.annotations;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.annotation.Annotation;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

public class IbanIdTest {
    @IbanId
    private String ibanField;

    @IbanId
    public void ibanMethod() {
    }

    @Test
    public void testIbanIdAnnotationOnField() throws NoSuchFieldException {
        Field field = this.getClass().getDeclaredField("ibanField");
        Annotation annotation = field.getAnnotation(IbanId.class);
        assertNotNull(annotation, "IbanId annotation should be present on the field");
    }

    @Test
    public void testIbanIdAnnotationOnMethod() throws NoSuchMethodException {
        Method method = this.getClass().getDeclaredMethod("ibanMethod");
        Annotation annotation = method.getAnnotation(IbanId.class);
        assertNotNull(annotation, "IbanId annotation should be present on the method");
    }

    @Test
    public void testIbanIdAnnotationRetentionPolicy() {
        Retention retention = IbanId.class.getAnnotation(Retention.class);
        assertNotNull(retention, "Retention annotation should be present on IbanId");
        assertTrue(retention.value() == RetentionPolicy.RUNTIME, "Retention policy should be RUNTIME");
    }

    @Test
    public void testIbanIdAnnotationTarget() {
        Target target = IbanId.class.getAnnotation(Target.class);
        assertNotNull(target, "Target annotation should be present on IbanId");
        assertTrue(target.value().length == 2, "Target should have two elements");
        assertTrue(target.value()[0] == ElementType.FIELD, "First target should be FIELD");
        assertTrue(target.value()[1] == ElementType.METHOD, "Second target should be METHOD");
    }
}