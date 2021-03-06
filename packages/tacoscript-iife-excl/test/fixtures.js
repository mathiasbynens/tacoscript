/*global suite,test*/
require('source-map-support').install()

var fs = require("fs")
var path = require("path")

var _ = require("lodash")
var chai = require("chai")
var devUtils = require("../../tacoscript-dev-utils")
chai.use(devUtils.chaiHelper)
var expect = chai.expect
var render = require("tacoscript-cst-utils").render
var saveAst = devUtils.saveAst

var horchata = require("horchata")

// TODO: should load parser and lexer from ../lib/index
horchata.registerPluginModule("iife-excl", require("../lib/horchata/parser"));

// TODO: rewrite mocha-fixtures-generic to be more generic, w.r.t directory structure

var fixtureRootBase = path.join(__dirname, "fixtures")
var fixtureRootDirs = fs.readdirSync(fixtureRootBase)

suite("tacoscript-iife-excl", function () {
  _.forEach(fixtureRootDirs, function(fixtureRootDir) { suite(fixtureRootDir, function () {

    var fixtureDirs = fs.readdirSync(path.join(fixtureRootBase, fixtureRootDir))
    .filter(function(fixtureDir) { return fs.statSync(path.join(fixtureRootBase, fixtureRootDir, fixtureDir)).isDirectory() })

    var optionsPath = path.join(fixtureRootBase, fixtureRootDir, "options.json")
    var options = {plugins: {"iife-excl": true}}; try { options = require(optionsPath) } catch(e) {}

    _.forEach(fixtureDirs, function(fixtureDir) {
      var fixtureBase = path.join(fixtureRootBase, fixtureRootDir, fixtureDir)
      var source; try {source = fs.readFileSync(path.join(fixtureBase, "source.taco"), "utf-8")} catch (e) {}
      test(fixtureDir, source !== undefined && function () {

        var fixtureAstPath = path.join(fixtureBase, "ast.json")
        var fixtureAst; try { fixtureAst = require(fixtureAstPath) } catch(e) {}
        var expectedErr; try { expectedErr = require(path.join(fixtureBase, "error.json")) } catch(e) {}

        var fixtureAstPath = path.join(fixtureBase, "ast.json")
        if (expectedErr) {
          expect(horchata.parse.bind(horchata, source, options)).to.throw(expectedErr.message)
        } else {
          var ast = horchata.parse(source, options)
          if (fixtureAst) {
            expect(ast).matches(fixtureAst)
            // expect(render(ast)).to.equal(source)
          } else {
            saveAst(fixtureAstPath, ast)
          }
        }

      }) /* end test */
    }) /* end forEach fixtureDirs */
  }) /* end suite */ }) /* end forEach fixtureRootDirs */
})
