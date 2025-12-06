@extends('errors::minimal')

@section('title', __('Server Error'))
@section('code', '500')
@section('message', __(app()->environment('local') ? ($exception->getMessage() ?: 'Server Error') : 'Server Error'))


