const { createProgram, flattenDiagnosticMessageText, getPreEmitDiagnostics } = require('typescript');

test('typings should work', () => {
  // SETUP: TypeScript compiler to compile ./typings/simple.ts.
  const program = createProgram(['./typings/simple.ts'], { noEmit: true, strict: true });

  // WHEN: Compile.
  const { diagnostics } = program.emit();

  // THEN: It should have no errors.
  const allDiagnostics = getPreEmitDiagnostics(program).concat(diagnostics);
  const errorMessages = allDiagnostics.map(({ messageText }) => flattenDiagnosticMessageText(messageText));

  expect(errorMessages).toHaveLength(0);
});
