/*
    Satisfaction - Simple MVVM Javascript Framework for different web apps
    Public Version: 0.0.1
    Copyright © 2023 Kirill Poroh & Team. Demo version.
*/


/**
 * Initialize and prepare to use framework dependencies
 * @return {void}
 */
function fm_initialize() {
    fm_setup_units();
    fm_unit_track_navigation();
    console.log("Satisfaction initialized.")
}

/**
 * Initialize and prepare to use units in document
 * @return {void}
 */
function fm_setup_units() {
    var moduleElement = document.querySelector('[module]');
    moduleElement.querySelectorAll("unit").forEach(
        function(element, index, array) {
            if(element.hasAttribute("preload")) {
                var moduleName = moduleElement.getAttribute("module");
                var unitName = element.getAttribute("name");
                fm_unit_load(moduleName, unitName);

                if(!element.hasAttribute("default")) {
                    element.style.display = "none";
                }
            }
        }
    );
}

/**
 * Load unit and prepare for use
 * @return {void}
 */
function fm_unit_load(moduleName, unitName, allowJavaScript = true) {
    var moduleElement = document.querySelector('[module="' + moduleName + '"]');
    moduleElement.querySelectorAll('unit[name="' + unitName + '"]').forEach(
        function(unitElement, index, array) {
            if(!unitElement.hasAttribute("loaded") || unitElement.hasAttribute("no-cache")) {
                var source = unitElement.getAttribute("src");
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open('GET', source, true);
                xmlHttpRequest.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
                xmlHttpRequest.onload = function() {
                    unitElement.setAttribute("loaded", "");
                    unitElement.innerHTML = this.responseText;

                    if(allowJavaScript) {
                        fm_unit_execute_js(moduleName, unitName);
                    }
                };
                xmlHttpRequest.send();
            }
        }
    );
}

/**
 * Looking for html elements with 'module-ref' attribute and allow navigation
 * @return {void}
 */
function fm_unit_track_navigation() {
    document.querySelectorAll('[module-ref]').forEach(
        function(element, index, array) {
            var moduleName = element.getAttribute("module-ref");
            var unitName = element.getAttribute("unit-name");
            element.addEventListener("click", function () {
                fm_unit_load(moduleName, unitName);
                fm_unit_navigate(moduleName, unitName);
            }, false);
        }
    );
}

/**
 * 
 * @return {void}
 */
function fm_unit_navigate(moduleName, unitName) {
    var moduleElement = document.querySelector('[module="' + moduleName + '"]');
    moduleElement.querySelectorAll("unit").forEach(
        function(element, index, array) {
            if(element.getAttribute("name") == unitName) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    );
}

function fm_unit_execute_js(moduleName, unitName) {
    var moduleElement = document.querySelector('[module="' + moduleName + '"]');
    moduleElement.querySelectorAll('unit[name="' + unitName + '"]').forEach(
        function(element, index, array) {
            element.querySelectorAll('script').forEach(
                function(scriptElement, index, array) {
                    eval(scriptElement.innerHTML);
                }
            );
        }
    );
}