"use strict";

const app = require("express").Router();
const Sequelize = require("sequelize");
const logger = require("../../services/LoggingService");
let pagination = require("../../services/PaginationService");
let SessionService = require("../../services/SessionService");
let JwtService = require("../../services/JwtService");
const ValidationService = require("../../services/ValidationService");
const PermissionService = require("../../services/PermissionService");
const UploadService = require("../../services/UploadService");
const AuthService = require("../../services/AuthService");
const db = require("../../models");
const helpers = require("../../core/helpers");

const role = 1;

app.get(
  "/admin/terminate",
  SessionService.verifySessionMiddleware(role, "admin"),
  async function (req, res, next) {
    res.render("admin/Add_Terminate");
  }
);

// app.get("/admin/terminate", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
//   try {
//     let session = req.session;

//     var viewModel = new paginateListViewModel(db.rule, "Rules", session.success, session.error, "/admin/rules");

//     const format = req.query.format ? req.query.format : "view";
//     const direction = req.query.direction ? req.query.direction : "ASC";
//     const per_page = req.query.per_page ? req.query.per_page : 10;
//     let order_by = req.query.order_by ? req.query.order_by : viewModel.get_field_column()[0];
//     let orderAssociations = [];
//     viewModel.set_order_by(order_by);
//     let joins = order_by.includes(".") ? order_by.split(".") : [];
//     order_by = order_by.includes(".") ? joins[joins.length - 1] : order_by;
//     if (joins.length > 0) {
//       for (let i = joins.length - 1; i > 0; i--) {
//         orderAssociations.push(`${joins[i - 1]}`);
//       }
//     }
//     // Check for flash messages
//     const flashMessageSuccess = req.flash("success");
//     if (flashMessageSuccess && flashMessageSuccess.length > 0) {
//       viewModel.success = flashMessageSuccess[0];
//     }
//     const flashMessageError = req.flash("error");
//     if (flashMessageError && flashMessageError.length > 0) {
//       viewModel.error = flashMessageError[0];
//     }

//     viewModel.set_id(req.query.id ? req.query.id : "");
//     viewModel.set_operator(req.query.operator ? req.query.operator : "");
//     viewModel.set_action(req.query.action ? req.query.action : "");
//     viewModel.set_output_variable_name(req.query.output_variable_name ? req.query.output_variable_name : "");

//     let where = helpers.filterEmptyFields({
//       id: viewModel.get_id(),
//       operator: viewModel.get_operator(),
//       action: viewModel.get_action(),
//       output_variable_name: viewModel.get_output_variable_name(),
//     });

//     const count = await db.rule._count(where, []);

//     viewModel.set_total_rows(count);
//     viewModel.set_per_page(+per_page);
//     viewModel.set_page(+req.params.num);
//     viewModel.set_query(req.query);
//     viewModel.set_sort_base_url(`/admin/rules/${+req.params.num}`);
//     viewModel.set_sort(direction);

//     const list = await db.rule.getPaginated(viewModel.get_page() - 1 < 0 ? 0 : viewModel.get_page(), viewModel.get_per_page(), where, order_by, direction, orderAssociations);

//     viewModel.set_list(list);

//     if (format == "csv") {
//       const csv = viewModel.to_csv();
//       return res
//         .set({
//           "Content-Type": "text/csv",
//           "Content-Disposition": 'attachment; filename="export.csv"',
//         })
//         .send(csv);
//     }

//     // if (format != 'view') {
//     //   res.json(viewModel.to_json());
//     // } else {
//     // }

//     return res.render("admin/Rules", viewModel);
//   } catch (error) {
//     console.error(error);
//     viewModel.error = error.message || "Something went wrong";
//     return res.render("admin/Rules", viewModel);
//   }
// });

// app.get("/admin/rules-add", SessionService.verifySessionMiddleware(role, "admin"), async function (req, res, next) {
//   if (req.session.csrf === undefined) {
//     req.session.csrf = SessionService.randomString(100);
//   }

//   const rulesAdminAddViewModel = require("../../view_models/rules_admin_add_view_model");

//   const viewModel = new rulesAdminAddViewModel(db.rule, "Add rule", "", "", "/admin/rules");
//   viewModel.outputVariables = await db.output_variable.getAll();
//   viewModel.actives = await db.active.getAll();
//   res.render("admin/Add_Rules", viewModel);
// });

// app.post(
//   "/admin/rules-add",
//   SessionService.verifySessionMiddleware(role, "admin"),
//   ValidationService.validateInput(
//     { output_variable_name: "required", actives: "required", operator: "required", compare_value: "required", action: "required" },
//     {
//       "output_variable_name.required": "OutputVariableName is required",
//       "actives.required": "Actives is required",
//       "operator.required": "Operator is required",
//       "compare_value.required": "CompareValue is required",
//       "action.required": "Action is required",
//     }
//   ),
//   async function (req, res, next) {
//     if (req.session.csrf === undefined) {
//       req.session.csrf = SessionService.randomString(100);
//     }
//     const rulesAdminAddViewModel = require("../../view_models/rules_admin_add_view_model");

//     const viewModel = new rulesAdminAddViewModel(db.rule, "Add rule", "", "", "/admin/rules");
//     viewModel.outputVariables = await db.output_variable.getAll();
//     viewModel.actives = await db.active.getAll();

//     // TODO use separate controller for image upload
//     //  {{{upload_field_setter}}}

//     let { output_variable_name, actives, operator, compare_value, min, max, action } = req.body;
//     if (!Array.isArray(actives)) {
//       actives = [actives];
//     }
//     viewModel.form_fields = {
//       ...viewModel.form_fields,
//       output_variable_name,
//       actives,
//       operator,
//       compare_value,
//       min,
//       max,
//       action,
//     };

//     try {
//       if (req.validationError) {
//         viewModel.error = req.validationError;
//         return res.render("admin/Add_Rules", viewModel);
//       }

//       viewModel.session = req.session;

//       const data = await db.rule.insert({ output_variable_name, actives: JSON.stringify(actives), operator, compare_value, min, max, action });

//       if (!data) {
//         viewModel.error = "Something went wrong";
//         return res.render("admin/Add_Rules", viewModel);
//       }

//       req.flash("success", "Rule created successfully");
//       return res.redirect("/admin/rules/0");
//     } catch (error) {
//       console.error(error);
//       viewModel.error = error.message || "Something went wrong";
//       return res.render("admin/Add_Rules", viewModel);
//     }
//   }
// );

// APIS

module.exports = app;
