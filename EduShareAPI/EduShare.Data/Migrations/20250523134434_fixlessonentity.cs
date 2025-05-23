using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixlessonentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "OrginalSummaryId",
                table: "Lessons",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 23, 13, 44, 34, 103, DateTimeKind.Utc).AddTicks(293), new DateTime(2025, 5, 23, 13, 44, 34, 103, DateTimeKind.Utc).AddTicks(294) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 23, 13, 44, 34, 103, DateTimeKind.Utc).AddTicks(298), new DateTime(2025, 5, 23, 13, 44, 34, 103, DateTimeKind.Utc).AddTicks(299) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "OrginalSummaryId",
                table: "Lessons",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(178), new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(179) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(183), new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(183) });
        }
    }
}
