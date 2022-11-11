const moment = require("moment");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { intersection } = require("lodash");
const coreModel = require("./../core/models");

module.exports = (sequelize, DataTypes) => {
  const Terminate = sequelize.define(
    "Terminate",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      msg: DataTypes.STRING,
      counter: DataTypes.INTEGER,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "terminate",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  coreModel.call(this, Terminate);

  Terminate._preCreateProcessing = function (data) {
    return data;
  };
  Terminate._postCreateProcessing = function (data) {
    return data;
  };
  Terminate._customCountingConditions = function (data) {
    return data;
  };

  Terminate._filterAllowKeys = function (data) {
    let cleanData = {};
    let allowedFields = Terminate.allowFields();
    allowedFields.push(Terminate._primaryKey());

    for (const key in data) {
      if (allowedFields.includes(key)) {
        cleanData[key] = data[key];
      }
    }
    return cleanData;
  };

  Terminate.timeDefaultMapping = function () {
    let results = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j++) {
        let hour = i < 10 ? "0".i : i;
        let min = j < 10 ? "0".j : j;
        results[i * 60 + j] = `${hour}:${min}`;
      }
    }
    return results;
  };

  Terminate.associate = function (models) {};

  Terminate.allowFields = function () {
    return ["id", "msg", "counter"];
  };

  Terminate.labels = function () {
    return ["ID", "msg", "counter"];
  };

  Terminate.validationRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["counter", "Counter", "required"],
    ];
  };

  Terminate.validationEditRules = function () {
    return [
      ["id", "ID", ""],
      ["name", "Name", "required"],
      ["counter", "Counter", ""],
    ];
  };

  // ex
  Terminate.intersection = function (fields) {
    if (fields) {
      return intersection(
        ["id", "name", "counter", "created_at", "updated_at"],
        Object.keys(fields)
      );
    } else return [];
  };

  return Terminate;
};
