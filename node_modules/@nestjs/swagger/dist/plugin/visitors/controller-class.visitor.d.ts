import * as ts from 'typescript';
import { AbstractFileVisitor } from './abstract.visitor';
export declare class ControllerClassVisitor extends AbstractFileVisitor {
    visit(sourceFile: ts.SourceFile, ctx: ts.TransformationContext, program: ts.Program): ts.SourceFile;
    addDecoratorToNode(compilerNode: ts.MethodDeclaration, typeChecker: ts.TypeChecker, hostFilename: string): ts.MethodDeclaration;
    createDecoratorObjectLiteralExpr(node: ts.MethodDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.ObjectLiteralExpression;
    createTypePropertyAssignment(node: ts.MethodDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.PropertyAssignment;
    createStatusPropertyAssignment(node: ts.MethodDeclaration, existingProperties: ts.NodeArray<ts.PropertyAssignment>): ts.PropertyAssignment;
    getStatusCodeIdentifier(node: ts.MethodDeclaration): any;
}
