/**
 * Copyright 2017 Advantech Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {
    'use strict';
    var brightness = require('node-atbrightness');
    var Not_Support = 'Not Support';

    function BrightnessGetNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        var msg = {};
        msg.payload = {};

        // Get Max
        function getbrightnessmax() {
            var data = brightness.getbrightnessmax();
            return data;
        }

        // Get Min
        function getbrightnessmin() {
            var data = brightness.getbrightnessmin();
            return data;
        }

        // Get Current
        function getbrightnessvalue() {
            var data = brightness.getbrightnessvalue();
            return data;
        }

        // Get Auto
        function checkautobrightness() {
            var data = brightness.checkautobrightness();
            if (data === 50) {
                data = Not_Support;
            }
            return data;
        }

        function init() {
            var msg = {};
            msg.payload = {};
            msg.payload.Max = getbrightnessmax();
            msg.payload.Min = getbrightnessmin();
            msg.payload.Value = getbrightnessvalue();
            msg.payload.Auto = checkautobrightness();
            if (msg.payload.Auto === 50) {
                msg.payload.Auto = Not_Support;
            }
            node.send(msg);
        }

        // Send msg once
        setTimeout(init, 1000);

        this.on('input', function (msg) {
            if (msg.payload.Max) {
                msg.payload.Max = getbrightnessmax();
            }
            if (msg.payload.Min) {
                msg.payload.Min = getbrightnessmin();
            }
            if (msg.payload.Value) {
                msg.payload.Value = getbrightnessvalue();
            }
            if (msg.payload.Auto) {
                msg.payload.Auto = checkautobrightness();
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType('Brightness data get', BrightnessGetNode);

    function BrightnessSetNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        this.on('input', function (msg) {
            var data = msg.payload;
            if (data !== null) {
                if (Number.isInteger(parseInt(data, 10)) && data >= 0) {
                    if (brightness.setbrightnessvalue(data) === 50) {
                        msg.payload = Not_Support;
                    } else {
                        msg.payload = brightness.getbrightnessvalue();
                    }
                } else if (typeof(data) === 'boolean') {
                    if (brightness.setautobrightness(data) === 50) {
                        msg.payload = Not_Support;
                    } else {
                        msg.payload = brightness.checkautobrightness();
                    }
                }
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType('Brightness data set', BrightnessSetNode);
};