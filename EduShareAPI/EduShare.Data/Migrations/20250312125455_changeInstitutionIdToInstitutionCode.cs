using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduShare.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeInstitutionIdToInstitutionCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Institutions_InstitutionId1",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_InstitutionId1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "InstitutionId1",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "InstitutionId",
                table: "Users",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "InstitutionCode",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Users_InstitutionId",
                table: "Users",
                column: "InstitutionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Institutions_InstitutionId",
                table: "Users",
                column: "InstitutionId",
                principalTable: "Institutions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Institutions_InstitutionId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_InstitutionId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "InstitutionCode",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "InstitutionId",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstitutionId1",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_InstitutionId1",
                table: "Users",
                column: "InstitutionId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Institutions_InstitutionId1",
                table: "Users",
                column: "InstitutionId1",
                principalTable: "Institutions",
                principalColumn: "Id");
        }
    }
}
