import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "FAKHR API",
    version: "1.0.0",
    description:
      "Complete REST API documentation for the FAKHR warehouse & employee management system.",
    contact: {
      name: "Fakhr Basha",
      email: "ahmedmhmdsala@gmail.com",
    },
  },
  servers: [
    // {
    //   url: "https://volcano-pi.vercel.app",
    //   description: "Production Server",
    // }
  ],
  tags: [
    { name: "Auth", description: "Authentication & user management endpoints" },
    { name: "Dashboard", description: "Dashboard summary endpoints" },
    { name: "Accounting", description: "Accounting & financial endpoints" },
    { name: "Reports", description: "System reports endpoints" },
    { name: "Sales", description: "Sales management endpoints" },
    { name: "Return Sales", description: "Return sales management endpoints" },
    { name: "Product", description: "Product management endpoints" },
    { name: "Customer", description: "Customer management endpoints" },
    { name: "Employee", description: "Employee management endpoints" },
    { name: "Attendance", description: "Attendance management endpoints" },
    { name: "Department", description: "Department management endpoints" },
    { name: "Material", description: "Material management endpoints" },
    { name: "Color", description: "Color management endpoints" },
    { name: "Yarn Stock", description: "Yarn stock management endpoints" },
    { name: "Supplier", description: "Supplier management endpoints" },
    { name: "Purchase Order", description: "Purchase order management endpoints" },
    { name: "Expenses", description: "Expenses management endpoints" },
    { name: "Notification", description: "Notification management endpoints" },
    { name: "Shift", description: "Work shift management endpoints" },
    { name: "Payroll", description: "Employee payroll & payment endpoints" }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token (without 'Bearer ' prefix)",
      },
    },
    schemas: {
      // ─── Auth ────────────────────────────────────────────────
      RegisterBody: {
        type: "object",
        required: ["userName", "email", "password", "confirmPassword", "role"],
        properties: {
          userName: { type: "string", minLength: 3, maxLength: 25, example: "john_doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", minLength: 6, example: "secret123" },
          confirmPassword: { type: "string", minLength: 6, example: "secret123" },
          phone: { type: "string", example: "01012345678" },
          role: { type: "string", enum: ["admin", "user", "employee"], example: "admin" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", example: "secret123" },
        },
      },
      ConfirmEmailBody: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          otp: { type: "string", example: "123456" },
        },
      },
      EmailOnlyBody: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
        },
      },
      ResetPasswordBody: {
        type: "object",
        required: ["email", "otp", "newPassword"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          otp: { type: "string", example: "123456" },
          newPassword: { type: "string", example: "newSecret123" },
        },
      },
      UpdatePasswordBody: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: { type: "string", example: "oldSecret123" },
          newPassword: { type: "string", example: "newSecret456" },
        },
      },
      CreateUserBody: {
        type: "object",
        required: ["firstName", "lastName", "email", "password", "role"],
        properties: {
          firstName: { type: "string", minLength: 3, maxLength: 25, example: "John" },
          lastName: { type: "string", minLength: 3, maxLength: 25, example: "Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", minLength: 6, example: "secret123" },
          phone: { type: "string", example: "01012345678" },
          role: { type: "string", enum: ["admin", "user", "employee", "supervisor", "manager"], example: "admin" },
          isConfirmed: { type: "boolean", example: true },
        },
      },
      UpdateRoleBody: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["admin", "user", "employee", "supervisor", "manager"], example: "admin" },
        },
      },
      // ─── Department ──────────────────────────────────────────
      DepartmentBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Spinning" },
        },
      },
      // ─── Employee ────────────────────────────────────────────
      CreateEmployeeBody: {
        type: "object",
        required: ["fullName", "salary", "phone", "role"],
        properties: {
          fullName: { type: "string", example: "Ahmed Hassan" },
          salary: { type: "number", example: 5000 },
          phone: { type: "string", example: "01098765432" },
          role: { type: "string", example: "supervisor" },
          shiftId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
        },
      },
      UpdateEmployeeBody: {
        type: "object",
        properties: {
          fullName: { type: "string", example: "Ahmed Hassan" },
          salary: { type: "number", example: 6000 },
          phone: { type: "string", example: "01098765432" },
          role: { type: "string", example: "manager" },
          departmentId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          shiftId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
        },
      },
      // ─── Shift ───────────────────────────────────────────────
      CreateShiftBody: {
        type: "object",
        required: ["name", "startTime", "endTime", "workingHours"],
        properties: {
          name: { type: "string", example: "Morning Shift" },
          startTime: { type: "string", example: "08:00" },
          endTime: { type: "string", example: "16:00" },
          workingHours: { type: "number", example: 8 },
        },
      },
      UpdateShiftBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Night Shift" },
          startTime: { type: "string", example: "22:00" },
          endTime: { type: "string", example: "06:00" },
          workingHours: { type: "number", example: 8 },
        },
      },
      // ─── Attendance ──────────────────────────────────────────
      CreateAttendanceBody: {
        type: "object",
        required: ["checkIn", "checkOut"],
        properties: {
          checkIn: { type: "string", example: "08:05", description: "Check-in time in HH:mm format. Use 00:00 for absent." },
          checkOut: { type: "string", example: "16:10", description: "Check-out time in HH:mm format. Use 00:00 for absent." },
        },
      },
      // ─── Payroll ─────────────────────────────────────────────
      CreatePayrollBody: {
        type: "object",
        required: ["employeeId", "amount"],
        properties: {
          employeeId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          amount: { type: "number", minimum: 0.01, example: 5000 },
          week: { type: "string", example: "2026-W24", description: "Optional week identifier" },
          note: { type: "string", maxLength: 200, example: "Weekly payment" },
        },
      },
      // ─── Material ────────────────────────────────────────────
      AddMaterialBody: {
        type: "object",
        required: ["name", "unit"],
        properties: {
          name: { type: "string", example: "Cotton Yarn" },
          description: { type: "string", example: "High quality cotton" },
          code: { type: "string", example: "CTN-001" },
          unit: { type: "string", enum: ["kg", "g", "meter", "piece"], example: "kg" },
        },
      },
      UpdateMaterialBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Polyester Yarn" },
          description: { type: "string", example: "Updated description" },
          code: { type: "string", example: "PLY-002" },
          unit: { type: "string", example: "meter" },
        },
      },
      // ─── Color ───────────────────────────────────────────────
      AddColorBody: {
        type: "object",
        required: ["name", "hexCode"],
        properties: {
          name: { type: "string", example: "Red" },
          hexCode: { type: "string", example: "#FF0000" },
        },
      },
      UpdateColorBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Dark Red" },
          hexCode: { type: "string", example: "#8B0000" },
        },
      },
      // ─── Yarn Stock ──────────────────────────────────────────
      AddYarnStockBody: {
        type: "object",
        required: ["materialId", "colorId", "quantity", "minQuantity"],
        properties: {
          materialId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          colorId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7c" },
          quantity: { type: "number", minimum: 0, example: 500 },
          minQuantity: { type: "number", minimum: 0, example: 50 },
        },
      },
      // ─── Stock Transaction ───────────────────────────────────
      StockInOutBody: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "number", minimum: 0, example: 100 },
          reason: { type: "string", example: "Monthly replenishment" },
        },
      },
      // ─── Purchase Order ──────────────────────────────────────
      PurchaseOrderItem: {
        type: "object",
        required: ["materialId", "colorId", "quantity", "unitPrice"],
        properties: {
          materialId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
          colorId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7c" },
          quantity: { type: "number", minimum: 1, example: 200 },
          unitPrice: { type: "number", minimum: 0.01, example: 35.5 },
        },
      },
      CreatePurchaseOrderBody: {
        type: "object",
        required: ["supplierId", "items"],
        properties: {
          supplierId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7d" },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/PurchaseOrderItem" },
          },
          notes: { type: "string", example: "Urgent delivery needed by end of week" },
        },
      },
      // ─── Supplier ────────────────────────────────────────────
      CreateSupplierBody: {
        type: "object",
        required: ["companyName", "contactPerson", "phone"],
        properties: {
          companyName: { type: "string", example: "Nile Textiles Co." },
          contactPerson: { type: "string", example: "Mohamed Ali" },
          email: { type: "string", format: "email", example: "contact@niletextiles.com" },
          phone: { type: "string", example: "01234567890" },
          address: { type: "string", example: "Cairo, Egypt" },
          note: { type: "string", example: "Preferred supplier" },
        },
      },
      UpdateSupplierBody: {
        type: "object",
        properties: {
          companyName: { type: "string", example: "Nile Textiles Co." },
          contactPerson: { type: "string", example: "Mohamed Ali" },
          email: { type: "string", format: "email", example: "new@niletextiles.com" },
          phone: { type: "string", example: "01234567890" },
          address: { type: "string", example: "Alexandria, Egypt" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Customer ────────────────────────────────────────────
      CreateCustomerBody: {
        type: "object",
        required: ["name", "phone", "address"],
        properties: {
          name: { type: "string", minLength: 3, example: "Mohamed Salem" },
          phone: { type: "string", minLength: 10, example: "01012345678" },
          address: { type: "string", minLength: 3, example: "Cairo, Egypt" },
          note: { type: "string", example: "Regular customer" },
        },
      },
      UpdateCustomerBody: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, example: "Mohamed Salem" },
          phone: { type: "string", minLength: 10, example: "01012345678" },
          address: { type: "string", minLength: 3, example: "Alexandria, Egypt" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Expense ─────────────────────────────────────────────
      CreateExpenseBody: {
        type: "object",
        required: ["title", "amount", "category"],
        properties: {
          title: { type: "string", minLength: 3, example: "Electricity Bill" },
          amount: { type: "number", minimum: 0.01, example: 1200 },
          category: { type: "string", minLength: 2, example: "Utilities" },
          expenseDate: { type: "string", format: "date", example: "2026-06-01" },
          note: { type: "string", example: "Monthly electricity payment" },
        },
      },
      UpdateExpenseBody: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 3, example: "Water Bill" },
          amount: { type: "number", minimum: 0.01, example: 500 },
          category: { type: "string", minLength: 2, example: "Utilities" },
          expenseDate: { type: "string", format: "date", example: "2026-06-05" },
          note: { type: "string", example: "Updated note" },
        },
      },
      // ─── Product ─────────────────────────────────────────────
      CreateProductBody: {
        type: "object",
        required: ["name", "sku", "category", "sellingPrice", "availableSizes", "availableColors", "quantity"],
        properties: {
          name: { type: "string", example: "Classic T-Shirt" },
          sku: { type: "string", example: "TS-001" },
          description: { type: "string", example: "Comfortable everyday cotton t-shirt" },
          category: { type: "string", example: "T-Shirts" },
          sellingPrice: { type: "string", example: "150" },
          availableSizes: {
            type: "array",
            items: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL"] },
            example: ["S", "M", "L"],
          },
          availableColors: {
            type: "array",
            items: { type: "string" },
            example: ["664f1c2e3a1b2c3d4e5f6a7c"],
          },
          quantity: { type: "string", example: "100" },
        },
      },
      UpdateProductBody: {
        type: "object",
        properties: {
          name: { type: "string", example: "Updated T-Shirt" },
          sku: { type: "string", example: "TS-001-V2" },
          description: { type: "string", example: "Updated description" },
          category: { type: "string", example: "T-Shirts" },
          sellingPrice: { type: "string", example: "175" },
          availableSizes: {
            type: "array",
            items: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL"] },
          },
          availableColors: { type: "array", items: { type: "string" } },
          quantity: { type: "string", example: "80" },
          isActive: { type: "boolean", example: true },
        },
      },
      // ─── Sales ───────────────────────────────────────────────
      CreateSaleBody: {
        type: "object",
        required: ["customerId", "items"],
        properties: {
          customerId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7d" },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity", "unitPrice"],
              properties: {
                productId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
                quantity: { type: "number", minimum: 1, example: 5 },
                unitPrice: { type: "number", minimum: 0.01, example: 150 },
              }
            }
          },
          note: { type: "string", example: "Deliver after 5 PM" },
        },
      },
      // ─── Return Sales ────────────────────────────────────────
      CreateReturnSaleBody: {
        type: "object",
        required: ["saleId", "items"],
        properties: {
          saleId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7f" },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: { type: "string", example: "664f1c2e3a1b2c3d4e5f6a7b" },
                quantity: { type: "number", minimum: 1, example: 2 },
                reason: { type: "string", example: "Defective item" },
              }
            }
          },
          note: { type: "string", example: "Refund requested" },
        },
      },
      // ─── Generic Responses ───────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operation completed successfully" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Something went wrong" },
          status: { type: "number", example: 400 },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/docs/**/*.yaml", "./src/docs/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
