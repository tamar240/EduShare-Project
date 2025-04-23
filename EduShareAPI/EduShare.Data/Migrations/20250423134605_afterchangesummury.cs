using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class afterchangesummury : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrginalSummaryId",
                table: "Lessons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProcessedSummaryId",
                table: "Lessons",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_ProcessedSummaryId",
                table: "Lessons",
                column: "ProcessedSummaryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Files_ProcessedSummaryId",
                table: "Lessons",
                column: "ProcessedSummaryId",
                principalTable: "Files",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Files_ProcessedSummaryId",
                table: "Lessons");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_ProcessedSummaryId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "OrginalSummaryId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "ProcessedSummaryId",
                table: "Lessons");
        }
    }
}
