package com.sd.stratos.service;

import com.sd.stratos.dto.AircraftCreateDTO;
import com.sd.stratos.dto.AircraftUpdateDTO;
import com.sd.stratos.entity.Aircraft;
import com.sd.stratos.entity.AircraftStatus;
import com.sd.stratos.entity.AircraftType;
import com.sd.stratos.exception.AircraftRegistrationNumberAlreadyExistsException;
import com.sd.stratos.repository.AircraftRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AircraftServiceTests {

    @Mock
    private AircraftRepository aircraftRepository;

    @InjectMocks
    private AircraftService aircraftService;

    @Test
    void testGetAllAircrafts() {
        /// Given:
        List<Aircraft> aircraftList = List.of(new Aircraft(), new Aircraft());

        /// When:
        when(aircraftRepository.findAll()).thenReturn(aircraftList);
        List<Aircraft> result = aircraftService.getAllAircrafts();

        /// Then:
        assertEquals(2, result.size());
        verify(aircraftRepository, times(1)).findAll();
        assertEquals(aircraftList, result);
    }

    @Test
    void testGetAircraftById() {
        /// Given:
        UUID aircraftId = UUID.randomUUID();
        Aircraft aircraft = new Aircraft();
        aircraft.setId(aircraftId);

        /// When:
        when(aircraftRepository.findById(aircraftId)).thenReturn(Optional.of(aircraft));
        Aircraft result = aircraftService.getAircraftById(aircraftId);

        /// Then:
        assertNotNull(result);
        assertEquals(aircraftId, result.getId());
        verify(aircraftRepository, times(1)).findById(aircraftId);
    }

    @Test
    void testGetAircraftByIdNotFound() {
        /// Given:
        UUID aircraftId = UUID.randomUUID();

        /// When:
        when(aircraftRepository.findById(aircraftId)).thenReturn(Optional.empty());
        Aircraft result = aircraftService.getAircraftById(aircraftId);

        /// Then:
        assertNull(result);
        verify(aircraftRepository, times(1)).findById(aircraftId);
    }

    @Test
    void testAddAircraft() {
        /// Given:
        AircraftCreateDTO aircraftCreateDTO = new AircraftCreateDTO("YR-REG", AircraftType.A320, AircraftStatus.OPERATIONAL);
        Aircraft aircraftToAdd = new Aircraft();
        aircraftToAdd.setRegistrationNumber("YR-REG");
        aircraftToAdd.setType(AircraftType.A320);
        aircraftToAdd.setStatus(AircraftStatus.OPERATIONAL);

        Aircraft savedAircraft = new Aircraft();
        savedAircraft.setId(UUID.randomUUID());
        savedAircraft.setRegistrationNumber("YR-REG");
        savedAircraft.setType(AircraftType.A320);
        savedAircraft.setStatus(AircraftStatus.OPERATIONAL);

        /// When:
        when(aircraftRepository.findAircraftByRegistrationNumber("YR-REG")).thenReturn(null);
        when(aircraftRepository.save(any(Aircraft.class))).thenReturn(savedAircraft);
        Aircraft result = aircraftService.addAircraft(aircraftCreateDTO);

        /// Then:
        assertNotNull(result);
        assertEquals(savedAircraft, result);
        verify(aircraftRepository, times(1)).findAircraftByRegistrationNumber("YR-REG");
        verify(aircraftRepository, times(1)).save(any(Aircraft.class));
    }

    @Test
    void testAddAircraftWithExistingRegistrationNumber() {
        /// Given:
        AircraftCreateDTO aircraftCreateDTO = new AircraftCreateDTO("YR-REG", AircraftType.A320, AircraftStatus.OPERATIONAL);
        Aircraft existingAircraft = new Aircraft();
        existingAircraft.setRegistrationNumber("YR-REG");

        /// When:
        when(aircraftRepository.findAircraftByRegistrationNumber("YR-REG")).thenReturn(existingAircraft);

        /// Then:
        assertThrows(AircraftRegistrationNumberAlreadyExistsException.class, () -> aircraftService.addAircraft(aircraftCreateDTO));
        verify(aircraftRepository, times(1)).findAircraftByRegistrationNumber("YR-REG");
        verify(aircraftRepository, never()).save(any(Aircraft.class));
    }

    @Test
    void testUpdateAircraft() {
        /// Given:
        UUID aircraftId = UUID.randomUUID();
        AircraftUpdateDTO updateDTO = new AircraftUpdateDTO(aircraftId,"EI-REG", AircraftType.B737, AircraftStatus.RETIRED);

        Aircraft existingAircraft = new Aircraft();
        existingAircraft.setId(aircraftId);
        existingAircraft.setRegistrationNumber("YR-REG");
        existingAircraft.setType(AircraftType.A320);
        existingAircraft.setStatus(AircraftStatus.OPERATIONAL);

        Aircraft updatedAircraft = new Aircraft();
        updatedAircraft.setId(aircraftId);
        updatedAircraft.setRegistrationNumber("EI-REG");
        updatedAircraft.setType(AircraftType.B737);
        updatedAircraft.setStatus(AircraftStatus.RETIRED);

        /// When:
        when(aircraftRepository.findById(aircraftId)).thenReturn(Optional.of(existingAircraft));
        when(aircraftRepository.save(any(Aircraft.class))).thenReturn(updatedAircraft);
        Aircraft result = aircraftService.updateAircraft(aircraftId, updateDTO);

        /// Then:
        assertEquals(updatedAircraft, result);
        verify(aircraftRepository, times(1)).findById(aircraftId);
        verify(aircraftRepository, times(1)).save(any(Aircraft.class));
    }

    @Test
    void testUpdateAircraftNotFound() {
        /// Given:
        UUID aircraftId = UUID.randomUUID();
        AircraftUpdateDTO updateDTO = new AircraftUpdateDTO(aircraftId,"YR-REG", AircraftType.A320, AircraftStatus.OPERATIONAL);

        /// When:
        when(aircraftRepository.findById(aircraftId)).thenReturn(Optional.empty());

        /// Then:
        assertThrows(IllegalStateException.class, () -> aircraftService.updateAircraft(aircraftId, updateDTO));
        verify(aircraftRepository, times(1)).findById(aircraftId);
        verify(aircraftRepository, never()).save(any(Aircraft.class));
    }

    @Test
    void testDeleteAircraft() {
        /// Given:
        UUID aircraftId = UUID.randomUUID();

        /// When:
        doNothing().when(aircraftRepository).deleteById(aircraftId);
        aircraftService.deleteAircraft(aircraftId);

        /// Then:
        verify(aircraftRepository, times(1)).deleteById(aircraftId);
    }

    @Test
    void testGetAllAircraftTypes() {
        /// When:
        List<AircraftType> result = aircraftService.getAllAircraftTypes();

        /// Then:
        assertNotNull(result);
        assertEquals(List.of(AircraftType.values()), result);
    }

    @Test
    void testGetAllAircraftStatuses() {
        /// When:
        List<AircraftStatus> result = aircraftService.getAllAircraftStatuses();

        /// Then:
        assertNotNull(result);
        assertEquals(List.of(AircraftStatus.values()), result);
    }
}
