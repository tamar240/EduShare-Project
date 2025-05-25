using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 25, 12, 31, 21, 820, DateTimeKind.Utc).AddTicks(4437), new DateTime(2025, 5, 25, 12, 31, 21, 820, DateTimeKind.Utc).AddTicks(4438) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 5, 25, 12, 31, 21, 820, DateTimeKind.Utc).AddTicks(4440), new DateTime(2025, 5, 25, 12, 31, 21, 820, DateTimeKind.Utc).AddTicks(4441) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
