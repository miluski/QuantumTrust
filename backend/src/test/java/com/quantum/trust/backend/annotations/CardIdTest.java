package com.quantum.trust.backend.annotations;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;

public class CardIdTest {
    @CardId
    private String cardField;

    @CardId
    public void cardMethod() {
    }

    @Test
    public void testCardIdAnnotationOnField() throws NoSuchFieldException {
        Field field = this.getClass().getDeclaredField("cardField");
        Annotation annotation = field.getAnnotation(CardId.class);
        assertNotNull(annotation, "CardId annotation should be present on the field");
        assertTrue(annotation instanceof CardId, "Annotation should be of type CardId");
    }

    @Test
    public void testCardIdAnnotationOnMethod() throws NoSuchMethodException {
        Method method = this.getClass().getDeclaredMethod("cardMethod");
        Annotation annotation = method.getAnnotation(CardId.class);
        assertNotNull(annotation, "CardId annotation should be present on the method");
        assertTrue(annotation instanceof CardId, "Annotation should be of type CardId");
    }
}