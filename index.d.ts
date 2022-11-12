/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

/** This is a const */
export const DEFAULT_COST: number;

export function xxh64Alias(input: Buffer): bigint

export namespace xxh3 {
	export const ALIGNMENT: number;

	export function xxh3_64(input: Buffer): bigint

	/** xxh128 function */
	export function xxh128(input: Buffer): bigint

	/** Xxh3 class */
	export class Xxh3 {
		constructor()

		/** update */
		update(input: Buffer): void

		digest(): bigint
	}
}
export namespace xxh2 {
	export function xxh2Plus(a: number, b: number): number

	export function xxh3Xxh64Alias(input: Buffer): bigint
}
