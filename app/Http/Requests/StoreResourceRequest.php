<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'url', 'max:255'],
            'url' => ['nullable', 'string', 'url', 'max:255'],
            'login' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'api_key' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['exists:resource_categories,id'],
            'media' => ['nullable', 'array'],
            'media.*' => ['file', 'max:10240'], // 10MB max per file
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The resource title is required.',
            'title.max' => 'The title cannot exceed 255 characters.',
            'image.url' => 'The image must be a valid URL.',
            'url.url' => 'The URL must be valid.',
            'categories.*.exists' => 'One or more selected categories do not exist.',
            'media.*.file' => 'Each media item must be a valid file.',
            'media.*.max' => 'Each media file cannot exceed 10MB.',
        ];
    }
}
