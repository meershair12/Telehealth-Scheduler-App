// const dayjs = require("dayjs");
// const { Op } = require("sequelize");
// const TelehealthProvider = require("../models/provider.model");
// const Availability = require("../models/scheduler.model");
// const Reservation = require("../models/reservation.model");
// // const { Provider, Availability, Reservation } = require("../models");

// exports.generateSummaryReport = async (req, res) => {
//   try {
//     const {
//       dateRange = "thisMonth",
//       provider = "all",
//       status = "all"
//     } = req.body;

//     // -------------------------
//     // 1️⃣ Define Date Range
//     // -------------------------
//     const today = dayjs();
//     let startDate, endDate;

//     switch (dateRange) {
//       case "thisWeek":
//         startDate = today.startOf("week").toDate();
//         endDate = today.endOf("week").toDate();
//         break;
//       case "lastWeek":
//         startDate = today.subtract(1, "week").startOf("week").toDate();
//         endDate = today.subtract(1, "week").endOf("week").toDate();
//         break;
//       case "lastMonth":
//         startDate = today.subtract(1, "month").startOf("month").toDate();
//         endDate = today.subtract(1, "month").endOf("month").toDate();
//         break;
//       default:
//         startDate = today.startOf("month").toDate();
//         endDate = today.endOf("month").toDate();
//     }

//     // -------------------------
//     // 2️⃣ Filters
//     // -------------------------
//     const whereClause = {
//       start: { [Op.between]: [startDate, endDate] },
//     };
//     if (status !== "all") whereClause.status = status;

//     const providerWhere = provider !== "all" ? { id: provider } : {};

//     // -------------------------
//     // 3️⃣ Fetch Data
//     // -------------------------
//     const providers = await TelehealthProvider.findAll({
//       where: providerWhere,
//       include: [
//         {
//           model: Availability,
//           required: false,
//           attributes: ["id"],
//           include: [
//             {
//               model: Reservation,
//               as: "reservations",
//               required: false,
//               where: whereClause,
//               attributes: ["status"],
//             },
//           ],
//         },
//       ],
//     });

//     if (!providers.length) {
//       return res.status(404).json({ message: "No data found for the selected filters." });
//     }

//     // -------------------------
//     // 4️⃣ Generate Summary
//     // -------------------------
//     const summary = providers.map((prov) => {
//       let totalAppointments = 0,
//         reserved = 0,
//         confirmed = 0,
//         cancelled = 0,
//         missed = 0,
//         availableSlots = prov.Availabilities?.length || 0;

//       prov.Availabilities?.forEach((slot) => {
//         slot.reservations?.forEach((r) => {
//           totalAppointments++;
//           switch (r.status) {
//             case "reserved":
//               reserved++;
//               break;
//             case "confirmed":
//               confirmed++;
//               break;
//             case "cancelled":
//               cancelled++;
//               break;
//             case "missed":
//               missed++;
//               break;
//           }
//         });
//       });

//       const utilization =
//         availableSlots > 0
//           ? ((totalAppointments / availableSlots) * 100).toFixed(1) + "%"
//           : "0%";

//       const confirmationRate =
//         totalAppointments > 0
//           ? ((confirmed / totalAppointments) * 100).toFixed(1) + "%"
//           : "0%";

//       return {
//         "Doctor Name": `${prov.firstName} ${prov.lastName}`,
//         Specialty: prov.specialty || "",
//         "Total Appointments": totalAppointments,
//         Reserved: reserved,
//         Confirmed: confirmed,
//         Cancelled: cancelled,
//         Missed: missed,
//         "Available Slots": availableSlots,
//         "Utilization %": utilization,
//         "Confirmation %": confirmationRate,
//         "Date Range": `${dayjs(startDate).format("YYYY-MM-DD")} → ${dayjs(endDate).format("YYYY-MM-DD")}`,
//       };
//     });

//     // -------------------------
//     // 5️⃣ Respond
//     // -------------------------
//     return res.json({
//       generatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//       totalProviders: summary.length,
//       dateRange: `${dayjs(startDate).format("YYYY-MM-DD")} → ${dayjs(endDate).format("YYYY-MM-DD")}`,
//       summary,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error generating summary report",
//       error: error.message,
//     });
//   }
// };
























const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const Availability = require("../models/scheduler.model");
const Reservation = require("../models/reservation.model");
const TelehealthProvider = require("../models/provider.model");
// const { generateCSV } = require("../utils/reportGenerator");

exports.generateSummaryReport = async (req, res) => {
  try {
    const {
      dateRange = "thisMonth",
      provider = "all",
      exportFormat = "excel", // 'csv' or 'excel'
      status = "all"
    } = req.body;

    // 1️⃣ Determine date range
    const today = dayjs();
    let startDate, endDate;

    switch (dateRange) {
      case "thisWeek":
        startDate = today.startOf("week").toDate();
        endDate = today.endOf("week").toDate();
        break;
      case "lastWeek":
        startDate = today.subtract(1, "week").startOf("week").toDate();
        endDate = today.subtract(1, "week").endOf("week").toDate();
        break;
      case "lastMonth":
        startDate = today.subtract(1, "month").startOf("month").toDate();
        endDate = today.subtract(1, "month").endOf("month").toDate();
        break;
      default:
        startDate = today.startOf("month").toDate();
        endDate = today.endOf("month").toDate();
    }

    // 2️⃣ Filters
    const whereClause = {
      start: { [Op.between]: [startDate, endDate] },
    };
    if (status !== "all") whereClause.status = status;

    const providerWhere = provider !== "all" ? { id: provider } : {};

    // 3️⃣ Fetch providers + reservations
    const providers = await TelehealthProvider.findAll({
      where: providerWhere,
      include: [
        {
          model: Availability,
          required: false,
          attributes: ["id"],
          include: [
            {
              model: Reservation,
              as: "reservations",
              required: false,
              attributes: ["status"],
              where: whereClause,
            },
          ],
        },
      ],
    });

    if (!providers.length) {
      return res.status(404).json({ message: "No data found for the selected filters." });
    }

    // 4️⃣ Calculate summary rows
    const rows = providers.map((prov) => {
      let totalAppointments = 0,
        reserved = 0,
        confirmed = 0,
        cancelled = 0,
        missed = 0,
        availableSlots = prov.Availabilities?.length || 0;

      prov.Availabilities?.forEach((slot) => {
  slot.reservations?.forEach((r) => {
    totalAppointments++;
    switch (r.status) {
      case "reserved":
        reserved++;
        break;
      case "confirmed":
        confirmed++;
        break;
      case "cancelled":
        cancelled++;
        break;
      case "missed":
        missed++;
        break;
    }
  });
});

let utilizationValue = 0;
if (availableSlots > 0) {
  utilizationValue = (confirmed / totalAppointments) * 100;
  if (utilizationValue > 100) utilizationValue = 100; // just in case
}
const utilization = `${utilizationValue.toFixed(1)}%`;

const confirmationRate =
  totalAppointments > 0
    ? ((confirmed / totalAppointments) * 100).toFixed(1) + "%"
    : "0%";

      return {
        "Doctor Name": `${prov.firstName} ${prov.lastName}`,
        Specialty: prov.specialty || "",
        "Total Appointments": totalAppointments,
        Reserved: reserved,
        Confirmed: confirmed,
        Cancelled: cancelled,
        Missed: missed,
        "Available Slots": availableSlots,
        "Utilization %": utilization,
        "Confirmation %": confirmationRate,
        "Date Range": `${dayjs(startDate).format("YYYY-MM-DD")} → ${dayjs(endDate).format("YYYY-MM-DD")}`,
      };
    });

    // 5️⃣ Generate Excel or CSV
    const reportsDir = path.join(__dirname, "../public/reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const providerName =
      provider === "all" ? "All Providers" : `${providers[0].firstName} ${providers[0].lastName}`;
    const monthName = today.format("MMMM YYYY");

    const filename = `${providerName.replace(/\s+/g, "_")}_Summary_Report_${monthName}.${exportFormat === "csv" ? "csv" : "xlsx"}`;
    const filePath = path.join(reportsDir, filename);

    if (exportFormat === "csv") {
      await generateCSV(rows, filePath);
    } else {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Summary Report");

      sheet.columns = Object.keys(rows[0]).map((k) => ({
        header: k,
        key: k,
        width: 20,
      }));

      sheet.addRows(rows);

      // Add header styling
      sheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD9EAD3" },
        };
      });

      await workbook.xlsx.writeFile(filePath);
    }

    // 6️⃣ Response metadata
    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    const fileMeta = {
      name: `${providerName} - Summary Report ${monthName}`,
      date: dayjs(stats.mtime).fromNow(),
      size: `${fileSizeMB} MB`,
      format: exportFormat === "csv" ? "CSV" : "Excel",
      provider: providerName,
      downloadLink: `${req.protocol}://${req.get("host")}/reports/${filename}`,
    };

    return res.json(fileMeta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error generating summary report",
      error: error.message,
    });
  }
};

