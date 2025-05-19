using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EduShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class new3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "Description", "RoleName", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(178), "System Administrator", "Admin", new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(179) },
                    { 2, new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(183), "Educator with upload permissions", "Teacher", new DateTime(2025, 5, 19, 17, 29, 7, 792, DateTimeKind.Utc).AddTicks(183) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
