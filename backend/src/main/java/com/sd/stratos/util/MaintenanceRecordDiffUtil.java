package com.sd.stratos.util;

import com.sd.stratos.entity.MaintenanceRecord;

import java.util.Objects;

public final class MaintenanceRecordDiffUtil {
    public static String diffRecords(MaintenanceRecord oldRecord, MaintenanceRecord newRecord) {
        StringBuilder changes = new StringBuilder();

        if (!Objects.equals(oldRecord.getAircraft().getRegistrationNumber(), newRecord.getAircraft().getRegistrationNumber())) {
            changes.append(String.format("Aircraft changed from '%s' to '%s'. ",
                    oldRecord.getAircraft().getRegistrationNumber(), newRecord.getAircraft().getRegistrationNumber()));
        }

        if (!Objects.equals(oldRecord.getType(), newRecord.getType())) {
            changes.append(String.format("Type changed from '%s' to '%s'. ", oldRecord.getType(), newRecord.getType()));
        }

        if (!Objects.equals(oldRecord.getStartDate(), newRecord.getStartDate())) {
            changes.append(String.format("Start date changed from '%s' to '%s'. ",
                    oldRecord.getStartDate(), newRecord.getStartDate()));
        }

        if (!Objects.equals(oldRecord.getEndDate(), newRecord.getEndDate())) {
            changes.append(String.format("End date changed from '%s' to '%s'. ",
                    oldRecord.getEndDate(), newRecord.getEndDate()));
        }

        if (!Objects.equals(oldRecord.getStatus(), newRecord.getStatus())) {
            changes.append(String.format("Status changed from '%s' to '%s'. ", oldRecord.getStatus(), newRecord.getStatus()));
        }

        return changes.toString().trim();
    }

}
