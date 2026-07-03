

type Primitive = string | number | symbol | bigint | boolean | null | undefined;

declare namespace util {
    type AssertEqual<T, U> = (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2 ? true : false;
    export type isAny<T> = 0 extends 1 & T ? true : false;
    export const assertEqual: <A, B>(val: AssertEqual<A, B>) => AssertEqual<A, B>;
    export function assertIs<T>(_arg: T): void;
    export function assertNever(_x: never): never;
    export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    export type OmitKeys<T, K extends string> = Pick<T, Exclude<keyof T, K>>;
    export type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
    export type Exactly<T, X> = T & Record<Exclude<keyof X, keyof T>, never>;
    export const arrayToEnum: <T extends string, U extends [T, ...T[]]>(items: U) => { [k in U[number]]: k; };
    export const getValidEnumValues: (obj: any) => any[];
    export const objectValues: (obj: any) => any[];
    export const objectKeys: ObjectConstructor["keys"];
    export const find: <T>(arr: T[], checker: (arg: T) => any) => T | undefined;
    export type identity<T> = objectUtil.identity<T>;
    export type flatten<T> = objectUtil.flatten<T>;
    export type noUndefined<T> = T extends undefined ? never : T;
    export const isInteger: NumberConstructor["isInteger"];
    export function joinValues<T extends any[]>(array: T, separator?: string): string;
    export const jsonStringifyReplacer: (_: string, value: any) => any;
    export {};
}
declare namespace objectUtil {
    export type MergeShapes<U, V> = {
        [k in Exclude<keyof U, keyof V>]: U[k];
    } & V;
    type optionalKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? k : never;
    }[keyof T];
    type requiredKeys<T extends object> = {
        [k in keyof T]: undefined extends T[k] ? never : k;
    }[keyof T];
    export type addQuestionMarks<T extends object, _O = any> = {
        [K in requiredKeys<T>]: T[K];
    } & {
        [K in optionalKeys<T>]?: T[K];
    } & {
        [k in keyof T]?: unknown;
    };
    export type identity<T> = T;
    export type flatten<T> = identity<{
        [k in keyof T]: T[k];
    }>;
    export type noNeverKeys<T> = {
        [k in keyof T]: [T[k]] extends [never] ? never : k;
    }[keyof T];
    export type noNever<T> = identity<{
        [k in noNeverKeys<T>]: k extends keyof T ? T[k] : never;
    }>;
    export const mergeShapes: <U, T>(first: U, second: T) => T & U;
    export type extendShape<A extends object, B extends object> = {
        [K in keyof A as K extends keyof B ? never : K]: A[K];
    } & {
        [K in keyof B]: B[K];
    };
    export {};
}
declare const ZodParsedType: {
    string: "string";
    number: "number";
    bigint: "bigint";
    boolean: "boolean";
    symbol: "symbol";
    undefined: "undefined";
    object: "object";
    function: "function";
    map: "map";
    nan: "nan";
    integer: "integer";
    float: "float";
    date: "date";
    null: "null";
    array: "array";
    unknown: "unknown";
    promise: "promise";
    void: "void";
    never: "never";
    set: "set";
};
type ZodParsedType = keyof typeof ZodParsedType;

type allKeys<T> = T extends any ? keyof T : never;
type typeToFlattenedError<T, U = string> = {
    formErrors: U[];
    fieldErrors: {
        [P in allKeys<T>]?: U[];
    };
};
declare const ZodIssueCode: {
    invalid_type: "invalid_type";
    invalid_literal: "invalid_literal";
    custom: "custom";
    invalid_union: "invalid_union";
    invalid_union_discriminator: "invalid_union_discriminator";
    invalid_enum_value: "invalid_enum_value";
    unrecognized_keys: "unrecognized_keys";
    invalid_arguments: "invalid_arguments";
    invalid_return_type: "invalid_return_type";
    invalid_date: "invalid_date";
    invalid_string: "invalid_string";
    too_small: "too_small";
    too_big: "too_big";
    invalid_intersection_types: "invalid_intersection_types";
    not_multiple_of: "not_multiple_of";
    not_finite: "not_finite";
};
type ZodIssueCode = keyof typeof ZodIssueCode;
type ZodIssueBase = {
    path: (string | number)[];
    message?: string;
};
interface ZodInvalidTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_type;
    expected: ZodParsedType;
    received: ZodParsedType;
}
interface ZodInvalidLiteralIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_literal;
    expected: unknown;
    received: unknown;
}
interface ZodUnrecognizedKeysIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.unrecognized_keys;
    keys: string[];
}
interface ZodInvalidUnionIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union;
    unionErrors: ZodError[];
}
interface ZodInvalidUnionDiscriminatorIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_union_discriminator;
    options: Primitive[];
}
interface ZodInvalidEnumValueIssue extends ZodIssueBase {
    received: string | number;
    code: typeof ZodIssueCode.invalid_enum_value;
    options: (string | number)[];
}
interface ZodInvalidArgumentsIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_arguments;
    argumentsError: ZodError;
}
interface ZodInvalidReturnTypeIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_return_type;
    returnTypeError: ZodError;
}
interface ZodInvalidDateIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_date;
}
type StringValidation = "email" | "url" | "emoji" | "uuid" | "nanoid" | "regex" | "cuid" | "cuid2" | "ulid" | "datetime" | "date" | "time" | "duration" | "ip" | "cidr" | "base64" | "jwt" | "base64url" | {
    includes: string;
    position?: number;
} | {
    startsWith: string;
} | {
    endsWith: string;
};
interface ZodInvalidStringIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_string;
    validation: StringValidation;
}
interface ZodTooSmallIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_small;
    minimum: number | bigint;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date" | "bigint";
}
interface ZodTooBigIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.too_big;
    maximum: number | bigint;
    inclusive: boolean;
    exact?: boolean;
    type: "array" | "string" | "number" | "set" | "date" | "bigint";
}
interface ZodInvalidIntersectionTypesIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.invalid_intersection_types;
}
interface ZodNotMultipleOfIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_multiple_of;
    multipleOf: number | bigint;
}
interface ZodNotFiniteIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.not_finite;
}
interface ZodCustomIssue extends ZodIssueBase {
    code: typeof ZodIssueCode.custom;
    params?: {
        [k: string]: any;
    };
}
type ZodIssueOptionalMessage = ZodInvalidTypeIssue | ZodInvalidLiteralIssue | ZodUnrecognizedKeysIssue | ZodInvalidUnionIssue | ZodInvalidUnionDiscriminatorIssue | ZodInvalidEnumValueIssue | ZodInvalidArgumentsIssue | ZodInvalidReturnTypeIssue | ZodInvalidDateIssue | ZodInvalidStringIssue | ZodTooSmallIssue | ZodTooBigIssue | ZodInvalidIntersectionTypesIssue | ZodNotMultipleOfIssue | ZodNotFiniteIssue | ZodCustomIssue;
type ZodIssue = ZodIssueOptionalMessage & {
    fatal?: boolean;
    message: string;
};
type recursiveZodFormattedError<T> = T extends [any, ...any[]] ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : T extends any[] ? {
    [k: number]: ZodFormattedError<T[number]>;
} : T extends object ? {
    [K in keyof T]?: ZodFormattedError<T[K]>;
} : unknown;
type ZodFormattedError<T, U = string> = {
    _errors: U[];
} & recursiveZodFormattedError<NonNullable<T>>;
declare class ZodError<T = any> extends Error {
    issues: ZodIssue[];
    get errors(): ZodIssue[];
    constructor(issues: ZodIssue[]);
    format(): ZodFormattedError<T>;
    format<U>(mapper: (issue: ZodIssue) => U): ZodFormattedError<T, U>;
    static create: (issues: ZodIssue[]) => ZodError<any>;
    static assert(value: unknown): asserts value is ZodError;
    toString(): string;
    get message(): string;
    get isEmpty(): boolean;
    addIssue: (sub: ZodIssue) => void;
    addIssues: (subs?: ZodIssue[]) => void;
    flatten(): typeToFlattenedError<T>;
    flatten<U>(mapper?: (issue: ZodIssue) => U): typeToFlattenedError<T, U>;
    get formErrors(): typeToFlattenedError<T, string>;
}
type stripPath<T extends object> = T extends any ? util.OmitKeys<T, "path"> : never;
type IssueData = stripPath<ZodIssueOptionalMessage> & {
    path?: (string | number)[];
    fatal?: boolean;
};
type ErrorMapCtx = {
    defaultError: string;
    data: any;
};
type ZodErrorMap = (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
    message: string;
};

type ParseParams = {
    path: (string | number)[];
    errorMap: ZodErrorMap;
    async: boolean;
};
type ParsePathComponent = string | number;
type ParsePath = ParsePathComponent[];
interface ParseContext {
    readonly common: {
        readonly issues: ZodIssue[];
        readonly contextualErrorMap?: ZodErrorMap;
        readonly async: boolean;
    };
    readonly path: ParsePath;
    readonly schemaErrorMap?: ZodErrorMap;
    readonly parent: ParseContext | null;
    readonly data: any;
    readonly parsedType: ZodParsedType;
}
type ParseInput = {
    data: any;
    path: (string | number)[];
    parent: ParseContext;
};
declare class ParseStatus {
    value: "aborted" | "dirty" | "valid";
    dirty(): void;
    abort(): void;
    static mergeArray(status: ParseStatus, results: SyncParseReturnType<any>[]): SyncParseReturnType;
    static mergeObjectAsync(status: ParseStatus, pairs: {
        key: ParseReturnType<any>;
        value: ParseReturnType<any>;
    }[]): Promise<SyncParseReturnType<any>>;
    static mergeObjectSync(status: ParseStatus, pairs: {
        key: SyncParseReturnType<any>;
        value: SyncParseReturnType<any>;
        alwaysSet?: boolean;
    }[]): SyncParseReturnType;
}
type INVALID = {
    status: "aborted";
};
declare const INVALID: INVALID;
type DIRTY<T> = {
    status: "dirty";
    value: T;
};
declare const DIRTY: <T>(value: T) => DIRTY<T>;
type OK<T> = {
    status: "valid";
    value: T;
};
declare const OK: <T>(value: T) => OK<T>;
type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID;
type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>;
type ParseReturnType<T> = SyncParseReturnType<T> | AsyncParseReturnType<T>;

declare namespace errorUtil {
    type ErrMessage = string | {
        message?: string;
    };
    const errToObj: (message?: ErrMessage) => {
        message?: string | undefined;
    };
    const toString: (message?: ErrMessage) => string | undefined;
}

/**
 * The Standard Schema interface.
 */
type StandardSchemaV1<Input = unknown, Output = Input> = {
    /**
     * The Standard Schema properties.
     */
    readonly "~standard": StandardSchemaV1.Props<Input, Output>;
};
declare namespace StandardSchemaV1 {
    /**
     * The Standard Schema properties interface.
     */
    export interface Props<Input = unknown, Output = Input> {
        /**
         * The version number of the standard.
         */
        readonly version: 1;
        /**
         * The vendor name of the schema library.
         */
        readonly vendor: string;
        /**
         * Validates unknown input values.
         */
        readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>;
        /**
         * Inferred types associated with the schema.
         */
        readonly types?: Types<Input, Output> | undefined;
    }
    /**
     * The result interface of the validate function.
     */
    export type Result<Output> = SuccessResult<Output> | FailureResult;
    /**
     * The result interface if validation succeeds.
     */
    export interface SuccessResult<Output> {
        /**
         * The typed output value.
         */
        readonly value: Output;
        /**
         * The non-existent issues.
         */
        readonly issues?: undefined;
    }
    /**
     * The result interface if validation fails.
     */
    export interface FailureResult {
        /**
         * The issues of failed validation.
         */
        readonly issues: ReadonlyArray<Issue>;
    }
    /**
     * The issue interface of the failure output.
     */
    export interface Issue {
        /**
         * The error message of the issue.
         */
        readonly message: string;
        /**
         * The path of the issue, if any.
         */
        readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
    }
    /**
     * The path segment interface of the issue.
     */
    export interface PathSegment {
        /**
         * The key representing a path segment.
         */
        readonly key: PropertyKey;
    }
    /**
     * The Standard Schema types interface.
     */
    export interface Types<Input = unknown, Output = Input> {
        /**
         * The input type of the schema.
         */
        readonly input: Input;
        /**
         * The output type of the schema.
         */
        readonly output: Output;
    }
    /**
     * Infers the input type of a Standard Schema.
     */
    export type InferInput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["input"];
    /**
     * Infers the output type of a Standard Schema.
     */
    export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<Schema["~standard"]["types"]>["output"];
    export {};
}

interface RefinementCtx {
    addIssue: (arg: IssueData) => void;
    path: (string | number)[];
}
type ZodRawShape = {
    [k: string]: ZodTypeAny;
};
type ZodTypeAny = ZodType<any, any, any>;
type input<T extends ZodType<any, any, any>> = T["_input"];
type output<T extends ZodType<any, any, any>> = T["_output"];

type CustomErrorParams = Partial<util.Omit<ZodCustomIssue, "code">>;
interface ZodTypeDef {
    errorMap?: ZodErrorMap;
    description?: string;
}
type RawCreateParams = {
    errorMap?: ZodErrorMap;
    invalid_type_error?: string;
    required_error?: string;
    message?: string;
    description?: string;
} | undefined;
type SafeParseSuccess<Output> = {
    success: true;
    data: Output;
    error?: never;
};
type SafeParseError<Input> = {
    success: false;
    error: ZodError<Input>;
    data?: never;
};
type SafeParseReturnType<Input, Output> = SafeParseSuccess<Output> | SafeParseError<Input>;
declare abstract class ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    readonly _type: Output;
    readonly _output: Output;
    readonly _input: Input;
    readonly _def: Def;
    get description(): string | undefined;
    "~standard": StandardSchemaV1.Props<Input, Output>;
    abstract _parse(input: ParseInput): ParseReturnType<Output>;
    _getType(input: ParseInput): string;
    _getOrReturnCtx(input: ParseInput, ctx?: ParseContext | undefined): ParseContext;
    _processInputParams(input: ParseInput): {
        status: ParseStatus;
        ctx: ParseContext;
    };
    _parseSync(input: ParseInput): SyncParseReturnType<Output>;
    _parseAsync(input: ParseInput): AsyncParseReturnType<Output>;
    parse(data: unknown, params?: Partial<ParseParams>): Output;
    safeParse(data: unknown, params?: Partial<ParseParams>): SafeParseReturnType<Input, Output>;
    "~validate"(data: unknown): StandardSchemaV1.Result<Output> | Promise<StandardSchemaV1.Result<Output>>;
    parseAsync(data: unknown, params?: Partial<ParseParams>): Promise<Output>;
    safeParseAsync(data: unknown, params?: Partial<ParseParams>): Promise<SafeParseReturnType<Input, Output>>;
    /** Alias of safeParseAsync */
    spa: (data: unknown, params?: Partial<ParseParams>) => Promise<SafeParseReturnType<Input, Output>>;
    refine<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, RefinedOutput, Input>;
    refine(check: (arg: Output) => unknown | Promise<unknown>, message?: string | CustomErrorParams | ((arg: Output) => CustomErrorParams)): ZodEffects<this, Output, Input>;
    refinement<RefinedOutput extends Output>(check: (arg: Output) => arg is RefinedOutput, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, RefinedOutput, Input>;
    refinement(check: (arg: Output) => boolean, refinementData: IssueData | ((arg: Output, ctx: RefinementCtx) => IssueData)): ZodEffects<this, Output, Input>;
    _refinement(refinement: RefinementEffect<Output>["refinement"]): ZodEffects<this, Output, Input>;
    superRefine<RefinedOutput extends Output>(refinement: (arg: Output, ctx: RefinementCtx) => arg is RefinedOutput): ZodEffects<this, RefinedOutput, Input>;
    superRefine(refinement: (arg: Output, ctx: RefinementCtx) => void): ZodEffects<this, Output, Input>;
    superRefine(refinement: (arg: Output, ctx: RefinementCtx) => Promise<void>): ZodEffects<this, Output, Input>;
    constructor(def: Def);
    optional(): ZodOptional<this>;
    nullable(): ZodNullable<this>;
    nullish(): ZodOptional<ZodNullable<this>>;
    array(): ZodArray<this>;
    promise(): ZodPromise<this>;
    or<T extends ZodTypeAny>(option: T): ZodUnion<[this, T]>;
    and<T extends ZodTypeAny>(incoming: T): ZodIntersection<this, T>;
    transform<NewOut>(transform: (arg: Output, ctx: RefinementCtx) => NewOut | Promise<NewOut>): ZodEffects<this, NewOut>;
    default(def: util.noUndefined<Input>): ZodDefault<this>;
    default(def: () => util.noUndefined<Input>): ZodDefault<this>;
    brand<B extends string | number | symbol>(brand?: B): ZodBranded<this, B>;
    catch(def: Output): ZodCatch<this>;
    catch(def: (ctx: {
        error: ZodError;
        input: Input;
    }) => Output): ZodCatch<this>;
    describe(description: string): this;
    pipe<T extends ZodTypeAny>(target: T): ZodPipeline<this, T>;
    readonly(): ZodReadonly<this>;
    isOptional(): boolean;
    isNullable(): boolean;
}
type IpVersion = "v4" | "v6";
type ZodStringCheck = {
    kind: "min";
    value: number;
    message?: string;
} | {
    kind: "max";
    value: number;
    message?: string;
} | {
    kind: "length";
    value: number;
    message?: string;
} | {
    kind: "email";
    message?: string;
} | {
    kind: "url";
    message?: string;
} | {
    kind: "emoji";
    message?: string;
} | {
    kind: "uuid";
    message?: string;
} | {
    kind: "nanoid";
    message?: string;
} | {
    kind: "cuid";
    message?: string;
} | {
    kind: "includes";
    value: string;
    position?: number;
    message?: string;
} | {
    kind: "cuid2";
    message?: string;
} | {
    kind: "ulid";
    message?: string;
} | {
    kind: "startsWith";
    value: string;
    message?: string;
} | {
    kind: "endsWith";
    value: string;
    message?: string;
} | {
    kind: "regex";
    regex: RegExp;
    message?: string;
} | {
    kind: "trim";
    message?: string;
} | {
    kind: "toLowerCase";
    message?: string;
} | {
    kind: "toUpperCase";
    message?: string;
} | {
    kind: "jwt";
    alg?: string;
    message?: string;
} | {
    kind: "datetime";
    offset: boolean;
    local: boolean;
    precision: number | null;
    message?: string;
} | {
    kind: "date";
    message?: string;
} | {
    kind: "time";
    precision: number | null;
    message?: string;
} | {
    kind: "duration";
    message?: string;
} | {
    kind: "ip";
    version?: IpVersion;
    message?: string;
} | {
    kind: "cidr";
    version?: IpVersion;
    message?: string;
} | {
    kind: "base64";
    message?: string;
} | {
    kind: "base64url";
    message?: string;
};
interface ZodStringDef extends ZodTypeDef {
    checks: ZodStringCheck[];
    typeName: ZodFirstPartyTypeKind.ZodString;
    coerce: boolean;
}
declare class ZodString extends ZodType<string, ZodStringDef, string> {
    _parse(input: ParseInput): ParseReturnType<string>;
    protected _regex(regex: RegExp, validation: StringValidation, message?: errorUtil.ErrMessage): ZodEffects<this, string, string>;
    _addCheck(check: ZodStringCheck): ZodString;
    email(message?: errorUtil.ErrMessage): ZodString;
    url(message?: errorUtil.ErrMessage): ZodString;
    emoji(message?: errorUtil.ErrMessage): ZodString;
    uuid(message?: errorUtil.ErrMessage): ZodString;
    nanoid(message?: errorUtil.ErrMessage): ZodString;
    cuid(message?: errorUtil.ErrMessage): ZodString;
    cuid2(message?: errorUtil.ErrMessage): ZodString;
    ulid(message?: errorUtil.ErrMessage): ZodString;
    base64(message?: errorUtil.ErrMessage): ZodString;
    base64url(message?: errorUtil.ErrMessage): ZodString;
    jwt(options?: {
        alg?: string;
        message?: string;
    }): ZodString;
    ip(options?: string | {
        version?: IpVersion;
        message?: string;
    }): ZodString;
    cidr(options?: string | {
        version?: IpVersion;
        message?: string;
    }): ZodString;
    datetime(options?: string | {
        message?: string | undefined;
        precision?: number | null;
        offset?: boolean;
        local?: boolean;
    }): ZodString;
    date(message?: string): ZodString;
    time(options?: string | {
        message?: string | undefined;
        precision?: number | null;
    }): ZodString;
    duration(message?: errorUtil.ErrMessage): ZodString;
    regex(regex: RegExp, message?: errorUtil.ErrMessage): ZodString;
    includes(value: string, options?: {
        message?: string;
        position?: number;
    }): ZodString;
    startsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    endsWith(value: string, message?: errorUtil.ErrMessage): ZodString;
    min(minLength: number, message?: errorUtil.ErrMessage): ZodString;
    max(maxLength: number, message?: errorUtil.ErrMessage): ZodString;
    length(len: number, message?: errorUtil.ErrMessage): ZodString;
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message?: errorUtil.ErrMessage): ZodString;
    trim(): ZodString;
    toLowerCase(): ZodString;
    toUpperCase(): ZodString;
    get isDatetime(): boolean;
    get isDate(): boolean;
    get isTime(): boolean;
    get isDuration(): boolean;
    get isEmail(): boolean;
    get isURL(): boolean;
    get isEmoji(): boolean;
    get isUUID(): boolean;
    get isNANOID(): boolean;
    get isCUID(): boolean;
    get isCUID2(): boolean;
    get isULID(): boolean;
    get isIP(): boolean;
    get isCIDR(): boolean;
    get isBase64(): boolean;
    get isBase64url(): boolean;
    get minLength(): number | null;
    get maxLength(): number | null;
    static create: (params?: RawCreateParams & {
        coerce?: true;
    }) => ZodString;
}
type ZodNumberCheck = {
    kind: "min";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "max";
    value: number;
    inclusive: boolean;
    message?: string;
} | {
    kind: "int";
    message?: string;
} | {
    kind: "multipleOf";
    value: number;
    message?: string;
} | {
    kind: "finite";
    message?: string;
};
interface ZodNumberDef extends ZodTypeDef {
    checks: ZodNumberCheck[];
    typeName: ZodFirstPartyTypeKind.ZodNumber;
    coerce: boolean;
}
declare class ZodNumber extends ZodType<number, ZodNumberDef, number> {
    _parse(input: ParseInput): ParseReturnType<number>;
    static create: (params?: RawCreateParams & {
        coerce?: boolean;
    }) => ZodNumber;
    gte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    min: (value: number, message?: errorUtil.ErrMessage) => ZodNumber;
    gt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    lte(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    max: (value: number, message?: errorUtil.ErrMessage) => ZodNumber;
    lt(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    protected setLimit(kind: "min" | "max", value: number, inclusive: boolean, message?: string): ZodNumber;
    _addCheck(check: ZodNumberCheck): ZodNumber;
    int(message?: errorUtil.ErrMessage): ZodNumber;
    positive(message?: errorUtil.ErrMessage): ZodNumber;
    negative(message?: errorUtil.ErrMessage): ZodNumber;
    nonpositive(message?: errorUtil.ErrMessage): ZodNumber;
    nonnegative(message?: errorUtil.ErrMessage): ZodNumber;
    multipleOf(value: number, message?: errorUtil.ErrMessage): ZodNumber;
    step: (value: number, message?: errorUtil.ErrMessage) => ZodNumber;
    finite(message?: errorUtil.ErrMessage): ZodNumber;
    safe(message?: errorUtil.ErrMessage): ZodNumber;
    get minValue(): number | null;
    get maxValue(): number | null;
    get isInt(): boolean;
    get isFinite(): boolean;
}
interface ZodUnknownDef extends ZodTypeDef {
    typeName: ZodFirstPartyTypeKind.ZodUnknown;
}
declare class ZodUnknown extends ZodType<unknown, ZodUnknownDef, unknown> {
    _unknown: true;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: (params?: RawCreateParams) => ZodUnknown;
}
interface ZodArrayDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodArray;
    exactLength: {
        value: number;
        message?: string;
    } | null;
    minLength: {
        value: number;
        message?: string;
    } | null;
    maxLength: {
        value: number;
        message?: string;
    } | null;
}
type ArrayCardinality = "many" | "atleastone";
type arrayOutputType<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> = Cardinality extends "atleastone" ? [T["_output"], ...T["_output"][]] : T["_output"][];
declare class ZodArray<T extends ZodTypeAny, Cardinality extends ArrayCardinality = "many"> extends ZodType<arrayOutputType<T, Cardinality>, ZodArrayDef<T>, Cardinality extends "atleastone" ? [T["_input"], ...T["_input"][]] : T["_input"][]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get element(): T;
    min(minLength: number, message?: errorUtil.ErrMessage): this;
    max(maxLength: number, message?: errorUtil.ErrMessage): this;
    length(len: number, message?: errorUtil.ErrMessage): this;
    nonempty(message?: errorUtil.ErrMessage): ZodArray<T, "atleastone">;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodArray<T_1, "many">;
}
type UnknownKeysParam = "passthrough" | "strict" | "strip";
type objectOutputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectUtil.flatten<objectUtil.addQuestionMarks<baseObjectOutputType<Shape>>> & CatchallOutput<Catchall> & PassthroughType<UnknownKeys>;
type baseObjectOutputType<Shape extends ZodRawShape> = {
    [k in keyof Shape]: Shape[k]["_output"];
};
type objectInputType<Shape extends ZodRawShape, Catchall extends ZodTypeAny, UnknownKeys extends UnknownKeysParam = UnknownKeysParam> = objectUtil.flatten<baseObjectInputType<Shape>> & CatchallInput<Catchall> & PassthroughType<UnknownKeys>;
type baseObjectInputType<Shape extends ZodRawShape> = objectUtil.addQuestionMarks<{
    [k in keyof Shape]: Shape[k]["_input"];
}>;
type CatchallOutput<T extends ZodType> = ZodType extends T ? unknown : {
    [k: string]: T["_output"];
};
type CatchallInput<T extends ZodType> = ZodType extends T ? unknown : {
    [k: string]: T["_input"];
};
type PassthroughType<T extends UnknownKeysParam> = T extends "passthrough" ? {
    [k: string]: unknown;
} : unknown;
type ZodUnionOptions = Readonly<[ZodTypeAny, ...ZodTypeAny[]]>;
interface ZodUnionDef<T extends ZodUnionOptions = Readonly<[
    ZodTypeAny,
    ZodTypeAny,
    ...ZodTypeAny[]
]>> extends ZodTypeDef {
    options: T;
    typeName: ZodFirstPartyTypeKind.ZodUnion;
}
declare class ZodUnion<T extends ZodUnionOptions> extends ZodType<T[number]["_output"], ZodUnionDef<T>, T[number]["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    get options(): T;
    static create: <T_1 extends readonly [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(types: T_1, params?: RawCreateParams) => ZodUnion<T_1>;
}
interface ZodIntersectionDef<T extends ZodTypeAny = ZodTypeAny, U extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    left: T;
    right: U;
    typeName: ZodFirstPartyTypeKind.ZodIntersection;
}
declare class ZodIntersection<T extends ZodTypeAny, U extends ZodTypeAny> extends ZodType<T["_output"] & U["_output"], ZodIntersectionDef<T, U>, T["_input"] & U["_input"]> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny, U_1 extends ZodTypeAny>(left: T_1, right: U_1, params?: RawCreateParams) => ZodIntersection<T_1, U_1>;
}
interface ZodPromiseDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodPromise;
}
declare class ZodPromise<T extends ZodTypeAny> extends ZodType<Promise<T["_output"]>, ZodPromiseDef<T>, Promise<T["_input"]>> {
    unwrap(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(schema: T_1, params?: RawCreateParams) => ZodPromise<T_1>;
}
type RefinementEffect<T> = {
    type: "refinement";
    refinement: (arg: T, ctx: RefinementCtx) => any;
};
type TransformEffect<T> = {
    type: "transform";
    transform: (arg: T, ctx: RefinementCtx) => any;
};
type PreprocessEffect<T> = {
    type: "preprocess";
    transform: (arg: T, ctx: RefinementCtx) => any;
};
type Effect<T> = RefinementEffect<T> | TransformEffect<T> | PreprocessEffect<T>;
interface ZodEffectsDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    schema: T;
    typeName: ZodFirstPartyTypeKind.ZodEffects;
    effect: Effect<any>;
}
declare class ZodEffects<T extends ZodTypeAny, Output = output<T>, Input = input<T>> extends ZodType<Output, ZodEffectsDef<T>, Input> {
    innerType(): T;
    sourceType(): T;
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <I extends ZodTypeAny>(schema: I, effect: Effect<I["_output"]>, params?: RawCreateParams) => ZodEffects<I, I["_output"]>;
    static createWithPreprocess: <I extends ZodTypeAny>(preprocess: (arg: unknown, ctx: RefinementCtx) => unknown, schema: I, params?: RawCreateParams) => ZodEffects<I, I["_output"], unknown>;
}

interface ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodOptional;
}
declare class ZodOptional<T extends ZodTypeAny> extends ZodType<T["_output"] | undefined, ZodOptionalDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodOptional<T_1>;
}
interface ZodNullableDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodNullable;
}
declare class ZodNullable<T extends ZodTypeAny> extends ZodType<T["_output"] | null, ZodNullableDef<T>, T["_input"] | null> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    unwrap(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodNullable<T_1>;
}
interface ZodDefaultDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    defaultValue: () => util.noUndefined<T["_input"]>;
    typeName: ZodFirstPartyTypeKind.ZodDefault;
}
declare class ZodDefault<T extends ZodTypeAny> extends ZodType<util.noUndefined<T["_output"]>, ZodDefaultDef<T>, T["_input"] | undefined> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeDefault(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        message?: string | undefined;
        description?: string | undefined;
    } & {
        default: T_1["_input"] | (() => util.noUndefined<T_1["_input"]>);
    }) => ZodDefault<T_1>;
}
interface ZodCatchDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    catchValue: (ctx: {
        error: ZodError;
        input: unknown;
    }) => T["_input"];
    typeName: ZodFirstPartyTypeKind.ZodCatch;
}
declare class ZodCatch<T extends ZodTypeAny> extends ZodType<T["_output"], ZodCatchDef<T>, unknown> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    removeCatch(): T;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params: {
        errorMap?: ZodErrorMap | undefined;
        invalid_type_error?: string | undefined;
        required_error?: string | undefined;
        message?: string | undefined;
        description?: string | undefined;
    } & {
        catch: T_1["_output"] | (() => T_1["_output"]);
    }) => ZodCatch<T_1>;
}
interface ZodBrandedDef<T extends ZodTypeAny> extends ZodTypeDef {
    type: T;
    typeName: ZodFirstPartyTypeKind.ZodBranded;
}
declare const BRAND: unique symbol;
type BRAND<T extends string | number | symbol> = {
    [BRAND]: {
        [k in T]: true;
    };
};
declare class ZodBranded<T extends ZodTypeAny, B extends string | number | symbol> extends ZodType<T["_output"] & BRAND<B>, ZodBrandedDef<T>, T["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    unwrap(): T;
}
interface ZodPipelineDef<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodTypeDef {
    in: A;
    out: B;
    typeName: ZodFirstPartyTypeKind.ZodPipeline;
}
declare class ZodPipeline<A extends ZodTypeAny, B extends ZodTypeAny> extends ZodType<B["_output"], ZodPipelineDef<A, B>, A["_input"]> {
    _parse(input: ParseInput): ParseReturnType<any>;
    static create<A extends ZodTypeAny, B extends ZodTypeAny>(a: A, b: B): ZodPipeline<A, B>;
}
type BuiltIn = (((...args: any[]) => any) | (new (...args: any[]) => any)) | {
    readonly [Symbol.toStringTag]: string;
} | Date | Error | Generator | Promise<unknown> | RegExp;
type MakeReadonly<T> = T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : T extends Set<infer V> ? ReadonlySet<V> : T extends [infer Head, ...infer Tail] ? readonly [Head, ...Tail] : T extends Array<infer V> ? ReadonlyArray<V> : T extends BuiltIn ? T : Readonly<T>;
interface ZodReadonlyDef<T extends ZodTypeAny = ZodTypeAny> extends ZodTypeDef {
    innerType: T;
    typeName: ZodFirstPartyTypeKind.ZodReadonly;
}
declare class ZodReadonly<T extends ZodTypeAny> extends ZodType<MakeReadonly<T["_output"]>, ZodReadonlyDef<T>, MakeReadonly<T["_input"]>> {
    _parse(input: ParseInput): ParseReturnType<this["_output"]>;
    static create: <T_1 extends ZodTypeAny>(type: T_1, params?: RawCreateParams) => ZodReadonly<T_1>;
    unwrap(): T;
}
declare enum ZodFirstPartyTypeKind {
    ZodString = "ZodString",
    ZodNumber = "ZodNumber",
    ZodNaN = "ZodNaN",
    ZodBigInt = "ZodBigInt",
    ZodBoolean = "ZodBoolean",
    ZodDate = "ZodDate",
    ZodSymbol = "ZodSymbol",
    ZodUndefined = "ZodUndefined",
    ZodNull = "ZodNull",
    ZodAny = "ZodAny",
    ZodUnknown = "ZodUnknown",
    ZodNever = "ZodNever",
    ZodVoid = "ZodVoid",
    ZodArray = "ZodArray",
    ZodObject = "ZodObject",
    ZodUnion = "ZodUnion",
    ZodDiscriminatedUnion = "ZodDiscriminatedUnion",
    ZodIntersection = "ZodIntersection",
    ZodTuple = "ZodTuple",
    ZodRecord = "ZodRecord",
    ZodMap = "ZodMap",
    ZodSet = "ZodSet",
    ZodFunction = "ZodFunction",
    ZodLazy = "ZodLazy",
    ZodLiteral = "ZodLiteral",
    ZodEnum = "ZodEnum",
    ZodEffects = "ZodEffects",
    ZodNativeEnum = "ZodNativeEnum",
    ZodOptional = "ZodOptional",
    ZodNullable = "ZodNullable",
    ZodDefault = "ZodDefault",
    ZodCatch = "ZodCatch",
    ZodPromise = "ZodPromise",
    ZodBranded = "ZodBranded",
    ZodPipeline = "ZodPipeline",
    ZodReadonly = "ZodReadonly"
}

type LogValueObject = {
    [key: string]: number | string | boolean | null | LogValueObject | LogValueObject[];
};

interface GitHubWorkflowResult {
    job_id: string;
    status: 'pending' | 'completed' | 'failed' | 'timeout';
    result?: {
        output?: any;
        workflow_run_id?: number;
        workflow_conclusion?: string;
        execution_time?: number;
    };
    artifacts?: Array<{
        id: number;
        name: string;
        size_bytes: number;
        content?: any;
        content_type?: string;
    }>;
    started_at?: string;
    completed_at?: string;
    github_url?: string;
    error?: string;
}

declare const SuspensePendingMarker: React.FC;
declare const Field: {
    readonly AiEditor: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        comments?: {
            userType: string;
            enabled: boolean;
        } | undefined;
        height?: number | undefined;
        contentEditable?: boolean | undefined;
        aiChecks?: {
            code?: {
                enabled: boolean;
                validate: boolean;
                checkTypes?: ("CODEBLOCK_EXISTS" | "INTRO_COMMENT_EXISTS" | "LANG_SPECIFIED" | "CODE_COMMENTS_EXISTS")[] | undefined;
            } | undefined;
            intent?: {
                enabled: boolean;
                validate: boolean;
                prompt: string;
            } | undefined;
            facts?: {
                enabled: boolean;
                sourceTexts?: string[] | undefined;
                sourceLinks?: string[] | undefined;
                maxSelectedSymbols?: number | undefined;
                suggestedFacts?: {
                    content: string;
                }[] | undefined;
            } | undefined;
            grammarScore?: {
                enabled: boolean;
                minScore: number;
                validate: boolean;
            } | undefined;
            wordCount?: {
                enabled: boolean;
                validate: boolean;
                min?: number | undefined;
                max?: number | undefined;
            } | undefined;
            tokenCount?: {
                enabled: boolean;
                validate: boolean;
                min?: number | undefined;
                max?: number | undefined;
                ignoreMarkdown?: boolean | undefined;
                tokenizerId?: "unigram_02pct_cc_v1.0_hf_converted_cleaned" | "claude-3-5-sonnet-20240620-anthropic-ai-count-tokens" | "claude-3-5-sonnet-20241022-anthropic-ai-count-tokens" | undefined;
                mondaySubitemId?: string | undefined;
            } | undefined;
            aiGenerated?: {
                enabled: boolean;
                validate: boolean;
                originalThreshold: number;
            } | undefined;
        } | undefined;
        defaultMode?: "markdown" | "rich-text" | undefined;
        imageType?: "url" | "base64" | "blob" | undefined;
        useSingleDollarMath?: boolean | undefined;
        defaultAiPanelContent?: "code" | "comments" | "intent" | "grammarScore" | "aiGenerated" | "fact" | undefined;
        requiredContent?: boolean | undefined;
        onChangeContent?: ((args_0: string) => void) | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    readonly Checkbox: React.FC<{
        path: string;
        label: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        description?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        preserveFalse?: boolean | undefined;
    }>;
    readonly ChatAssistant: React.FC<{
        path: string;
        options?: {
            thinking?: {
                type: "enabled";
                budget_tokens?: number | undefined;
            } | undefined;
            top_p?: number | null | undefined;
            top_k?: number | null | undefined;
            max_tokens?: number | undefined;
            timeout?: number | undefined;
            tools?: any[] | undefined;
        } | undefined;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        mondaySubitemId?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        temperature?: number | undefined;
        modelId?: string | undefined;
        initialMessage?: string | undefined;
        context?: string | undefined;
    }>;
    readonly Code: React.FC<{
        path: string;
        language: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        formating?: boolean | undefined;
    }>;
    readonly CodeExecution: React.FC<{
        path: string;
        language: "python@3.10.0" | "javascript@20.11.1";
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        formating?: boolean | undefined;
    }>;
    readonly DialogReview: React.FC<{
        path: string;
        allowedMetaModels: Partial<Record<"chatgpt" | "claude" | "gemini" | "meta" | "meta_1" | "meta_2", string>>;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        topic?: string | undefined;
        qa?: boolean | undefined;
        models?: ("chatgpt" | "claude" | "gemini" | "meta" | "meta_1" | "meta_2")[] | undefined;
        dimensions?: string[] | undefined;
    }>;
    readonly External: React.FC<{
        path: string;
        url: string;
        config: {};
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    readonly FaceCollection: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        qa?: boolean | undefined;
        mobileOnly?: boolean | undefined;
        variation?: "A" | "B" | undefined;
        page?: number | undefined;
        debug?: boolean | undefined;
        samePersonThreshold?: {
            selfie?: number | undefined;
            pose?: number | undefined;
            historical?: number | undefined;
        } | undefined;
    }>;
    readonly FileUpload: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        multiple?: boolean | undefined;
        accept?: string[] | undefined;
        linkType?: "sasLink" | "downloadLink" | undefined;
        minimumFiles?: number | undefined;
    }>;
    readonly ImageAnnotation: React.FC<{
        path: string;
        image: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        tools?: ("rectangle" | "polygon")[] | undefined;
        labels?: {
            value: string;
            label: string;
            color: "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "white";
        }[] | undefined;
        questions?: ({
            type: "text";
            key: string;
            label?: string | undefined;
            required?: boolean | undefined;
            placeholder?: string | undefined;
        } | {
            options: {
                value: string;
                label: string;
            }[];
            type: "toggle-group";
            key: string;
            label?: string | undefined;
            required?: boolean | undefined;
        } | {
            options: {
                value: string;
                label?: React.ReactNode;
            }[];
            type: "select";
            key: string;
            label?: string | undefined;
            required?: boolean | undefined;
            placeholder?: string | undefined;
        } | {
            type: "number";
            key: string;
            min?: number | undefined;
            max?: number | undefined;
            label?: string | undefined;
            required?: boolean | undefined;
            placeholder?: string | undefined;
            decimalScale?: number | undefined;
        })[] | undefined;
        annotationSize?: {
            minHeight?: number | undefined;
            minWidth?: number | undefined;
        } | undefined;
        displayLabels?: boolean | undefined;
        navigator?: boolean | undefined;
        defaultAnnotationColor?: "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "white" | undefined;
    }>;
    readonly ImageSkeletonAnnotation: React.FC<{
        path: string;
        tools: {
            type: string;
            label: string;
            color: "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "white";
            template: Record<string, [number, number]>;
            connections: [string, string][];
            pointsColor?: Record<string, "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "white"> | undefined;
            showPointLabel?: boolean | undefined;
            scale?: number | undefined;
        }[];
        image: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    readonly JsonSchemaForm: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        schema?: any;
    }>;
    readonly List: React.FC<{
        path: string;
        renderItem: (args_0: string, args_1: any, args_2: number) => React.ReactNode;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        flat?: boolean | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        maxLength?: number | undefined;
        itemWithBorder?: boolean | undefined;
        addButtonLabel?: string | undefined;
        addButtonVariant?: "default" | "secondary" | "ghost" | "outline" | undefined;
        gap?: string | number | undefined;
        reorderable?: boolean | undefined;
    }>;
    readonly MlEndpoint: React.FC<{
        path: string;
        label: string;
        endpoint: string;
        data: {} | (() => {});
        function?: string | undefined;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        mondaySubitemId?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        use_cache?: boolean | undefined;
        postProcessingFn?: ((endpointResult: any) => any) | undefined;
        variant?: "default" | "secondary" | "ghost" | "outline" | undefined;
        complain?: {
            type?: "button" | "checkbox" | undefined;
            label?: string | undefined;
            defaultComment?: string | undefined;
            onSuccess?: (() => void) | undefined;
            instruction?: string | undefined;
        } | undefined;
    }>;
    readonly MlEndpointMultiple: React.FC<{
        path: string;
        label: string;
        requests: {
            endpoint: string;
            data: {} | (() => {});
            function?: string | undefined;
            mondaySubitemId?: string | undefined;
            use_cache?: boolean | undefined;
            postProcessingFn?: ((endpointResult: any) => any) | undefined;
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        variant?: "default" | "secondary" | "ghost" | "outline" | undefined;
        complain?: {
            type?: "button" | "checkbox" | undefined;
            label?: string | undefined;
            defaultComment?: string | undefined;
            onSuccess?: (() => void) | undefined;
            instruction?: string | undefined;
        } | undefined;
    }>;
    readonly MultiSelect: React.FC<{
        path: string;
        options: {
            value: string;
            label: string;
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        placeholder?: string | undefined;
    }>;
    readonly Number: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        min?: number | undefined;
        max?: number | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        placeholder?: string | undefined;
        decimalScale?: number | undefined;
    }>;
    readonly PortalChatAssistant: React.FC<{
        path: string;
        options?: {
            thinking?: {
                type: "enabled";
                budget_tokens?: number | undefined;
            } | undefined;
            top_p?: number | null | undefined;
            top_k?: number | null | undefined;
            max_tokens?: number | undefined;
            timeout?: number | undefined;
            tools?: any[] | undefined;
        } | undefined;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        height?: number | undefined;
        mondaySubitemId?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        temperature?: number | undefined;
        modelId?: string | undefined;
        initialMessage?: string | undefined;
        context?: string | undefined;
    }>;
    readonly RadioGroup: React.FC<{
        path: string;
        options: {
            value: string;
            label: string;
            hint?: string | undefined;
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    readonly Select: React.FC<{
        path: string;
        options: {
            value: string;
            disabled?: boolean | undefined;
            label?: React.ReactNode;
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        placeholder?: string | undefined;
    }>;
    readonly ShopifyOneDcg: React.FC<{
        path: string;
        shopAppEmail: string;
        country: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        name?: string | undefined;
        qa?: boolean | undefined;
        query?: string | undefined;
        queryShape?: "keyword" | "complex" | "conversational" | undefined;
        persona?: {
            uuid?: string | undefined;
            relationship?: string | undefined;
            summary?: string | undefined;
            snapshot?: unknown;
            lookup_source?: string | undefined;
        } | undefined;
        pairsTarget?: number | undefined;
        isTest?: boolean | undefined;
        reasoningFactors?: {
            id: string;
            label: string;
        }[] | undefined;
    }>;
    readonly SpeechToText: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        mondaySubitemId?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        modelId?: "gpt-4o-transcribe" | "gpt-4o-mini-transcribe" | undefined;
        placeholder?: string | undefined;
    }>;
    readonly SpeechToTextV2: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        mondaySubitemId?: string | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        modelId?: "gpt-4o-transcribe" | "gpt-4o-mini-transcribe" | undefined;
        placeholder?: string | undefined;
    }>;
    readonly Text: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        placeholder?: string | undefined;
        spellCheck?: boolean | undefined;
        disabledCopy?: boolean | undefined;
        disabledPaste?: boolean | undefined;
    }>;
    readonly TextAnnotation: React.FC<{
        content: string;
        path: string;
        labels: {
            value: string;
            label: string;
            color: "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "white";
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        mode?: "classifying" | "classifying-commenting" | undefined;
        adjust?: "symbols" | "words" | undefined;
    }>;
    readonly Textarea: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        placeholder?: string | undefined;
        spellCheck?: boolean | undefined;
        disabledCopy?: boolean | undefined;
        disabledPaste?: boolean | undefined;
        resizable?: boolean | undefined;
        rows?: number | undefined;
    }>;
    readonly ToggleGroup: React.FC<{
        path: string;
        options: {
            value: string;
            label: string;
            disabled?: boolean | undefined;
        }[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        type?: "multiple" | "single" | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    readonly VideoTimelineSegmentation: React.FC<{
        path: string;
        video: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        questions?: {
            keyframes?: ({
                type: "text";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
                placeholder?: string | undefined;
            } | {
                options: {
                    value: string;
                    label: string;
                    disabled?: boolean | undefined;
                }[];
                type: "toggle-group";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
            })[] | ((args_0: objectInputType<{
                time: ZodNumber;
            }, ZodUnknown, "strip">) => ({
                type: "text";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
                placeholder?: string | undefined;
            } | {
                options: {
                    value: string;
                    label: string;
                    disabled?: boolean | undefined;
                }[];
                type: "toggle-group";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
            })[]) | undefined;
            segments?: ({
                type: "text";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
                placeholder?: string | undefined;
            } | {
                options: {
                    value: string;
                    label: string;
                    disabled?: boolean | undefined;
                }[];
                type: "toggle-group";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
            })[] | ((args_0: objectInputType<{
                from: ZodNumber;
                to: ZodNumber;
            }, ZodUnknown, "strip">) => ({
                type: "text";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
                placeholder?: string | undefined;
            } | {
                options: {
                    value: string;
                    label: string;
                    disabled?: boolean | undefined;
                }[];
                type: "toggle-group";
                key: string;
                label?: string | undefined;
                required?: boolean | undefined;
            })[]) | undefined;
        } | undefined;
        mode?: "keyframes" | "segments" | "keyframes-segments" | undefined;
        videoHeight?: number | undefined;
        defaultPlaybackRate?: 1 | 2 | 0.25 | 0.5 | 0.75 | 1.25 | 1.5 | undefined;
    }>;
    readonly VideoFraming: React.FC<{
        path: string;
        video: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        videoHeight?: number | undefined;
        defaultPlaybackRate?: 1 | 2 | 0.25 | 0.5 | 0.75 | 1.25 | 1.5 | undefined;
    }>;
    readonly VideoRecord: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        mobileOnly?: boolean | undefined;
        linkType?: "sasLink" | "downloadLink" | undefined;
        minHeight?: number | undefined;
        minWidth?: number | undefined;
        orientation?: "landscape" | "portrait" | undefined;
        lockScreenOrientation?: boolean | undefined;
        minDurationSec?: number | undefined;
        maxDurationSec?: number | undefined;
        cameraFacing?: "user" | "environment" | undefined;
        audio?: boolean | undefined;
        recordingQuality?: "high" | "low" | "balanced" | undefined;
        unsupportedMessage?: string | undefined;
        nativeCamera?: boolean | undefined;
        lens?: "default" | "wide" | "ultraWide" | "tele" | undefined;
        minFovDeg?: number | undefined;
        minFps?: number | undefined;
        minBitrate?: number | undefined;
        hdrMode?: "off" | "hdr10" | "auto" | undefined;
        lightingThreshold?: number | undefined;
    }>;
    readonly VideoUpload: React.FC<{
        path: string;
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        multiple?: boolean | undefined;
        accept?: string[] | undefined;
        linkType?: "sasLink" | "downloadLink" | undefined;
        minimumFiles?: number | undefined;
        orientation?: "landscape" | "portrait" | "square" | undefined;
        minDurationSec?: number | undefined;
        maxDurationSec?: number | undefined;
    }>;
    readonly WorldSearch: React.FC<{
        path: string;
        availableWorlds: string[];
        validation?: {
            message?: string | undefined;
            type?: "string" | "number" | "boolean" | "object" | "integer" | "float" | "date" | "array" | "url" | "enum" | "hex" | "email" | "any" | undefined;
            min?: number | undefined;
            max?: number | undefined;
            required?: boolean | undefined;
            enum?: (string | number | boolean | null | undefined)[] | undefined;
            len?: number | undefined;
            pattern?: string | RegExp | undefined;
            whitespace?: boolean | undefined;
            fields?: {} | undefined;
            validator?: ((fieldValue: any) => true | Error) | undefined;
        }[] | undefined;
        onChange?: ((changedValue: unknown) => void) | undefined;
        disabled?: boolean | undefined;
        label?: React.ReactNode;
        hint?: React.ReactNode;
        required?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        perPage?: number | undefined;
        selectDocuments?: boolean | undefined;
    }>;
};
declare const Layout: {
    StickyHeader: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        header?: React.ReactNode;
    } & {
        children: React.ReactNode;
    }>;
};
declare const View: {
    ActionButton: React.FC<{
        label: string;
        action: () => any;
        disabled?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        variant?: "default" | "secondary" | "ghost" | "outline" | undefined;
        loadingLabel?: string | undefined;
    }>;
    Alert: React.FC<{
        title?: React.ReactNode;
        description?: React.ReactNode;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        variant?: "error" | "default" | "info" | "success" | "warning" | undefined;
        padding?: "sm" | "md" | undefined;
        icon?: boolean | undefined;
    }>;
    Audio: React.FC<{
        url: string;
        validation?: {
            playedFully?: boolean | undefined;
        } | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    Card: React.FC<{
        flat?: boolean | undefined;
        title?: React.ReactNode;
        description?: React.ReactNode;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        variant?: "error" | "default" | "info" | "success" | "warning" | undefined;
        view?: "fill" | "outline" | undefined;
    } & {
        children: React.ReactNode;
    }>;
    CodeDiff: React.FC<{
        original: string;
        language: string;
        modified: string;
        height?: number | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        sideBySide?: boolean | undefined;
    }>;
    Col: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        span?: number | undefined;
        offset?: number | undefined;
        getParams?: ((args_0: number) => {
            span?: number | undefined;
            offset?: number | undefined;
        }) | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Collapsible: React.FC<{
        flat?: boolean | undefined;
        title?: React.ReactNode;
        disabled?: boolean | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        variant?: "default" | "info" | undefined;
        defaultOpen?: boolean | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Divider: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
    }>;
    Flex: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        gap?: string | number | [string | number, string | number] | undefined;
        justify?: "start" | "end" | "center" | "normal" | "space-around" | "space-between" | undefined;
        vertical?: boolean | undefined;
        wrap?: boolean | undefined;
        align?: "start" | "end" | "middle" | "stretch" | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Image: React.FC<{
        src: string;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        preview?: boolean | undefined;
    }>;
    ImageGallery: React.FC<{
        images: string[];
        height?: number | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        preview?: boolean | undefined;
    }>;
    Label: React.FC<{
        label?: React.ReactNode;
        hint?: React.ReactNode;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    Labels: React.FC<{
        labels: {
            title: string;
            value?: string | number | null | undefined;
            theme?: "default" | "alert" | "success" | undefined;
        }[];
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    LeafletMap: React.FC<{
        center: [number, number];
        height?: number | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        zoom?: number | undefined;
        markers?: {
            position: [number, number];
            color?: string | undefined;
            popup?: string | undefined;
        }[] | undefined;
    }>;
    Link: React.FC<{
        url: string;
        validation?: {
            opened?: boolean | undefined;
        } | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Markdown: React.FC<{
        content: string;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        disabledCopy?: boolean | undefined;
        html?: boolean | undefined;
    }>;
    Row: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        gap?: string | number | [string | number, string | number] | undefined;
        justify?: "start" | "end" | "center" | "space-around" | "space-between" | undefined;
        align?: "start" | "end" | "middle" | "stretch" | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Tabs: React.FC<{
        tabs: {
            value: string;
            content?: React.ReactNode;
            label?: string | undefined;
        }[];
        flat?: boolean | undefined;
        title?: React.ReactNode;
        description?: React.ReactNode;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        defaultTab?: string | undefined;
        tabsViewKey?: string | undefined;
    }>;
    Text: React.FC<{
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        color?: "error" | "secondary" | "primary" | undefined;
        variant?: "code" | "blockquote" | "h1" | "h2" | "h3" | "h4" | "p" | "small" | "large" | undefined;
    } & {
        children: React.ReactNode;
    }>;
    TextDiff: React.FC<{
        source: string;
        target: string;
        label?: string | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        defaultOpen?: boolean | undefined;
        algorithm?: "symbols" | "words" | undefined;
        contentHeight?: number | undefined;
        tabsLabels?: {
            source?: string | undefined;
            target?: string | undefined;
            diff?: string | undefined;
        } | undefined;
    }>;
    Tutorial: React.FC<{
        uniqueId: string;
        steps: {
            title: string;
            description?: string | undefined;
            tutorialId?: string | undefined;
            disableActiveInteraction?: boolean | undefined;
        }[];
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        instant?: boolean | undefined;
        withButton?: boolean | undefined;
        allowClose?: boolean | undefined;
    } & {
        children: React.ReactNode;
    }>;
    Pdf: React.FC<{
        url: string;
        height?: number | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    Video: React.FC<{
        url: string;
        validation?: {
            playedFully?: boolean | undefined;
        } | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
        ratio?: number | undefined;
    }>;
    Onboarding: React.FC<{
        modules: {
            id: string;
            role: string;
            steps: {
                id: string;
                validators: {
                    id: string;
                    description: string;
                    required: boolean;
                    name: string;
                    criteria: string;
                }[];
                content?: React.ReactNode;
            }[];
            scenario: string;
            goal: string;
            successCriteria: string;
        }[];
        flat?: boolean | undefined;
        title?: React.ReactNode;
        description?: React.ReactNode;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    Training: React.FC<{
        steps: {
            id: string;
            blocks: any[];
        }[];
        title?: string | undefined;
        description?: string | undefined;
        style?: React.CSSProperties | undefined;
        tutorialId?: string | undefined;
        entityCustomId?: string | undefined;
    }>;
    TrainingTheory: React.FC<{
        id: string;
        content?: ({
            value: string;
            type: "markdown";
        } | {
            value: string;
            type: "image";
            description?: string | undefined;
            alt?: string | undefined;
        } | {
            value: string;
            type: "video";
            description?: string | undefined;
        } | {
            value: string;
            type: "code";
            description?: string | undefined;
            language?: string | undefined;
        })[] | undefined;
        title?: string | undefined;
    }>;
    TrainingConsent: React.FC<{
        id: string;
        consentLabel: string;
        content?: ({
            value: string;
            type: "markdown";
        } | {
            value: string;
            type: "image";
            description?: string | undefined;
            alt?: string | undefined;
        } | {
            value: string;
            type: "video";
            description?: string | undefined;
        } | {
            value: string;
            type: "code";
            description?: string | undefined;
            language?: string | undefined;
        })[] | undefined;
        path?: string | undefined;
        title?: string | undefined;
        disabled?: boolean | undefined;
    }>;
    TrainingQuiz: React.FC<{
        id: string;
        questions: {
            options: {
                value: string;
                label: string;
            }[];
            type: "single-choice" | "multiple-choice";
            id: string;
            question: string;
            correctAnswer: string | string[];
            hint?: string | undefined;
            correctAnswerFeedback?: string | undefined;
            incorrectAnswerFeedback?: string | undefined;
        }[];
        content?: ({
            value: string;
            type: "markdown";
        } | {
            value: string;
            type: "image";
            description?: string | undefined;
            alt?: string | undefined;
        } | {
            value: string;
            type: "video";
            description?: string | undefined;
        } | {
            value: string;
            type: "code";
            description?: string | undefined;
            language?: string | undefined;
        })[] | undefined;
        path?: string | undefined;
        title?: string | undefined;
        disabled?: boolean | undefined;
    }>;
    TrainingPractice: React.FC<{
        id: string;
        validators: {
            id: string;
            description: string;
            required: boolean;
            name: string;
            criteria: string;
        }[];
        editorType: "TEXT" | "MARKDOWN" | "CODE";
        content?: ({
            value: string;
            type: "markdown";
        } | {
            value: string;
            type: "image";
            description?: string | undefined;
            alt?: string | undefined;
        } | {
            value: string;
            type: "video";
            description?: string | undefined;
        } | {
            value: string;
            type: "code";
            description?: string | undefined;
            language?: string | undefined;
        })[] | undefined;
        path?: string | undefined;
        title?: string | undefined;
        disabled?: boolean | undefined;
        imageUrl?: string | undefined;
        editorConfig?: {
            language?: string | undefined;
            placeholder?: string | undefined;
            rows?: number | undefined;
        } | undefined;
    }>;
    TrainingInfo: React.FC<{
        id: string;
        role?: string | undefined;
        goal?: string | undefined;
        successCriteria?: string | undefined;
        completionTime?: string | undefined;
    }>;
};
declare const Validation: React.FC<{
    message: string;
    style?: React.CSSProperties | undefined;
    tutorialId?: string | undefined;
    entityCustomId?: string | undefined;
    isValid?: any;
} & {
    children: React.ReactNode;
}>;
declare const actions: {
    llm: (params: {
        path: string;
        prompt: string | {
            content: {
                type: string;
            }[];
            role: string;
        }[] | (() => string | {
            content: {
                type: string;
            }[];
            role: string;
        }[]);
        options?: {
            thinking?: {
                type: "enabled";
                budget_tokens?: number | undefined;
            } | undefined;
            top_p?: number | null | undefined;
            top_k?: number | null | undefined;
            max_tokens?: number | undefined;
            timeout?: number | undefined;
            tools?: any[] | undefined;
        } | undefined;
        temperature?: number | undefined;
        system_prompt?: string | undefined;
        model_id?: string | undefined;
        response_format_type?: "json_object" | undefined;
        image_url?: string | undefined;
        image_detail?: "high" | "low" | undefined;
        json_schema?: {} | undefined;
        plugins?: string[] | undefined;
        return_full_body?: boolean | undefined;
        use_litellm?: boolean | undefined;
        parseJson?: boolean | undefined;
        monday_subitem_id?: string | undefined;
        platform_project_id?: string | undefined;
    }) => Promise<string | null>;
    llmMultiple: (params: {
        path: string;
        requests: {
            prompt: string | {
                content: {
                    type: string;
                }[];
                role: string;
            }[] | (() => string | {
                content: {
                    type: string;
                }[];
                role: string;
            }[]);
            options?: {
                thinking?: {
                    type: "enabled";
                    budget_tokens?: number | undefined;
                } | undefined;
                top_p?: number | null | undefined;
                top_k?: number | null | undefined;
                max_tokens?: number | undefined;
                timeout?: number | undefined;
                tools?: any[] | undefined;
            } | undefined;
            mondaySubitemId?: string | undefined;
            temperature?: number | undefined;
            system_prompt?: string | undefined;
            model_id?: string | undefined;
            response_format_type?: "json_object" | undefined;
            image_url?: string | undefined;
            image_detail?: "high" | "low" | undefined;
            json_schema?: {} | undefined;
            plugins?: string[] | undefined;
            return_full_body?: boolean | undefined;
            use_litellm?: boolean | undefined;
            parseJson?: boolean | undefined;
        }[];
    }) => Promise<(string | null)[]>;
    mlEndpoint: (params: {
        path: string;
        endpoint: string;
        data: {} | (() => {});
        function?: string | undefined;
        mondaySubitemId?: string | undefined;
        use_cache?: boolean | undefined;
        postProcessingFn?: ((endpointResult: any) => any) | undefined;
    }) => Promise<any>;
    mlEndpointMultiple: (params: {
        path: string;
        requests: {
            endpoint: string;
            data: {} | (() => {});
            function?: string | undefined;
            mondaySubitemId?: string | undefined;
            use_cache?: boolean | undefined;
            postProcessingFn?: ((endpointResult: any) => any) | undefined;
        }[];
    }) => Promise<any[]>;
    githubWorkflow: ((params: {
        path: string;
        ref: string;
        owner: string;
        repo: string;
        workflow: string;
        inputs: Record<string, any> | (() => Record<string, any>);
        mondaySubitemId?: string | undefined;
        timeout?: number | undefined;
        postProcessingFn?: ((endpointResult: any) => any) | undefined;
    }) => Promise<any>) & {
        start: (params: {
            ref: string;
            owner: string;
            repo: string;
            workflow: string;
            inputs: Record<string, any> | (() => Record<string, any>);
            mondaySubitemId?: string | undefined;
            jobStorePath?: string | undefined;
        }) => Promise<GitHubWorkflowResult>;
        poll: (params: {
            mondaySubitemId?: string | undefined;
            jobStorePath?: string | undefined;
            jobId?: string | undefined;
        }) => Promise<GitHubWorkflowResult>;
        getResults: (params: {
            path: string;
            mondaySubitemId?: string | undefined;
            timeout?: number | undefined;
            postProcessingFn?: ((endpointResult: any) => any) | undefined;
            jobStorePath?: string | undefined;
            jobId?: string | undefined;
        }) => Promise<unknown>;
    };
    get: (path: string, defaultValue?: any) => any;
    set: (path: string, payload: any) => void;
    setTab: (params: {
        tabsViewKey: string;
        tabValue: string;
        scrollToTabStart?: boolean | undefined;
    }) => void;
    nextTab: (params: {
        tabsViewKey: string;
        scrollToTabStart?: boolean | undefined;
        cycle?: boolean | undefined;
    }) => void;
    convertMarkdownToLlmPrompt: (params: {
        markdown: string;
        model?: "claude" | "gpt" | undefined;
    }) => {
        content: objectOutputType<{
            type: ZodString;
        }, ZodUnknown, "strip">[];
        role: string;
    }[];
    getTextDiff: (params: {
        source: string;
        target: string;
        algorithm?: "symbols" | "words" | undefined;
    }) => Promise<number>;
    notify: (params: {
        message: string;
        variant: "error" | "info" | "success" | "warning";
    }) => void;
    executeCode: (params: {
        code: string;
        language: "python@3.10.0" | "javascript@20.11.1";
    }) => Promise<{
        output: string;
        isError: boolean;
    }>;
    startEditing: (params: undefined) => Promise<{
        success: boolean;
    }>;
    submitTask: (params: {
        patchValues?: Record<string, any> | undefined;
        resetValues?: Record<string, any> | undefined;
    }) => Promise<{
        success: boolean;
    }>;
    invalidateTask: (params: undefined) => Promise<{
        success: boolean;
    }>;
    unassignAndExit: (params: {
        withoutConfirmation?: boolean | undefined;
    }) => Promise<{
        success: boolean;
    }>;
    sendUserLog: (params: {
        value: LogValueObject;
        type: string;
    }) => Promise<unknown>;
};

export { Field, Layout, SuspensePendingMarker, Validation, View, actions };
