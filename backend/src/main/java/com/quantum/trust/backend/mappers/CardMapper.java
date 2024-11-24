package com.quantum.trust.backend.mappers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import com.quantum.trust.backend.model.dto.CardDto;
import com.quantum.trust.backend.model.entities.Card;

@Component
public class CardMapper {
    public CardDto convertToCardDto(Card card) {
        LocalDate expirationDate = LocalDate.parse(card.getExpirationDate());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
        String formattedExpirationDate = expirationDate.format(formatter);

        return CardDto
                .builder()
                .id(card.getId())
                .assignedAccountNumber(card.getAccount().getId())
                .backImage(card.getBackImage())
                .cvcCode(card.getCvcCode())
                .expirationDate(formattedExpirationDate)
                .fees(card.getFees())
                .image(card.getImage())
                .limits(card.getLimits())
                .pin(card.getPin())
                .publisher(card.getPublisher())
                .showingCardSite(card.getShowingCardSite())
                .status(card.getStatus())
                .type(card.getType())
                .build();
    }

    public Card convertToCard(CardDto cardDto) {
        return Card
                .builder()
                .backImage(cardDto.getBackImage())
                .cvcCode(cardDto.getCvcCode())
                .expirationDate(cardDto.getExpirationDate())
                .fees(cardDto.getFees())
                .image(cardDto.getImage())
                .limits(cardDto.getLimits())
                .pin(cardDto.getPin())
                .publisher(cardDto.getPublisher())
                .showingCardSite(cardDto.getShowingCardSite())
                .status(cardDto.getStatus())
                .type(cardDto.getType())
                .build();
    }
}
