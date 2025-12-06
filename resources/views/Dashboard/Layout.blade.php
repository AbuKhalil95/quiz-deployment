<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/img/apple-icon.png">
    <link rel="icon" type="image/png" href="../img/quiz-3d-icon-png-download-12914559.webp">
    <title>
        @yield("title")
    </title>
    <!--     Fonts and icons     -->
    <link rel="stylesheet" type="text/css"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Roboto+Slab:400,700" />
    <!-- Nucleo Icons -->
    <link href="../assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="../assets/css/nucleo-svg.css" rel="stylesheet" />
    <!-- Font Awesome Icons -->
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
    <!-- CSS Files -->
    <link id="pagestyle" href="../assets/css/material-dashboard.css?v=3.0.0" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

    <!-- ------------------ -->


    <!-- fontawesome -->
    <script src="https://kit.fontawesome.com/659ed253a5.js" crossorigin="anonymous"></script>
    <!-- csrf-token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- toaster -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <!-- sweetalert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- dataTaqbel -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="http://cdn.datatables.net/2.1.5/css/dataTables.dataTables.min.css">
    <script src="http://cdn.datatables.net/2.1.5/js/dataTables.min.js"></script>

</head>

<body class="g-sidenav-show bg-gray-200">
    <aside
        class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark"
        id="sidenav-main">
        <div class="sidenav-header">
            <i class="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
                aria-hidden="true" id="iconSidenav"></i>
            <a class="navbar-brand m-0" {{ Route::is('student.dashboard') ? 'active' : '' }}"
                href="{{ route('student.dashboard') }}">
                <img src="../assets/img/logo-ct.png" class="navbar-brand-img h-100" alt="main_logo" />
                <span class="ms-1 font-weight-bold text-white">Quiz</span>
            </a>
        </div>
        <hr class="horizontal light mt-0 mb-2" />
        <div class="collapse navbar-collapse w-auto max-height-vh-100" id="sidenav-collapse-main">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">

                    <a class="nav-link text-white dropdown-toggle {{ Route::is('users.index') || Route::is('role.index') || Route::is('roleUser.index') || Route::is('permission.index') || Route::is('permissionRole.index') ? 'active bg-gradient-primary' : '' }}"
                        href="#" id="userRoleDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">group</i>
                        </div>
                        <span class="nav-link-text ms-1">Users & Roles</span>
                    </a>

                    <ul class=" m-3  dropdown-menu  " aria-labelledby="userRoleDropdown">
                        <li>
                            <a class="dropdown-item {{ Route::is('users.index') ? 'active' : '' }}"
                                href="{{ route('users.index') }}">
                                Users
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item {{ Route::is('role.index') ? 'active' : '' }}"
                                href="{{ route('role.index') }}">
                                Roles
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item {{ Route::is('roleUser.index') ? 'active' : '' }}"
                                href="{{ route('roleUser.index') }}">
                                Role User
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item {{ Route::is('permission.index') ? 'active' : '' }}"
                                href="{{ route('permission.index') }}">
                                Permissions
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item {{ Route::is('permissionRole.index') ? 'active' : '' }}"
                                href="{{ route('permissionRole.index') }}">
                                Permissions Roles
                            </a>
                        </li>
                    </ul>
                </li>



                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('subject.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('subject.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">category</i>
                        </div>
                        <span class="nav-link-text ms-1">Subjects</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('question.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('question.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">assignment</i>
                        </div>
                        <span class="nav-link-text ms-1">Questions </span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('questionOption.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('questionOption.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">help</i>
                        </div>
                        <span class="nav-link-text ms-1"> Questions Options</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('quiz.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('quiz.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">quiz</i>
                        </div>
                        <span class="nav-link-text ms-1"> Quizzes</span>
                    </a>
                </li>


                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('quizQuestion.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('quizQuestion.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">fact_check</i>
                        </div>
                        <span class="nav-link-text ms-1"> QuizQuestion</span>
                    </a>
                </li>


                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('attempt.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('attempt.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">how_to_reg</i>
                        </div>
                        <span class="nav-link-text ms-1"> Attempt</span>
                    </a>
                </li>


                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('answer.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('answer.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">assignment_turned_in</i>
                        </div>
                        <span class="nav-link-text ms-1"> Answers</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('tag.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('tag.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">tag</i>
                        </div>
                        <span class="nav-link-text ms-1"> Tag</span>
                    </a>
                </li>


                <li class="nav-item">
                    <a class="nav-link text-white {{ Route::is('questionTag.index') ? 'active bg-gradient-primary' : '' }}"
                        href="{{ route('questionTag.index') }}">
                        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                            <i class="material-icons opacity-10">label</i>
                        </div>
                        <span class="nav-link-text ms-1"> Question Tag</span>
                    </a>
                </li>



            </ul>
        </div>
        <div class="sidenav-footer position-absolute w-100 bottom-0">
            <div class="mx-3">

                <form action="{{ route('logout') }}" method="POST" class="d-inline">
                    @csrf
                    <button type="submit" class="btn bg-gradient-primary mt-4 w-100">
                        Logout
                    </button>
                </form>
            </div>



        </div>
    </aside>
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <!-- Navbar -->
        <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur"
            navbar-scroll="true">
            <div class="container-fluid py-1 px-3">


                @php
                    // Map your route names to page titles
                    $routeName = Route::currentRouteName();
                    $pageTitles = [
                        'users.index' => 'Users Table',
                        'role.index' => 'Roles Table',
                        'roleUser.index' => 'Role User Table',
                        'permission.index' => 'Permissions Table',
                        'permissionRole.index' => 'Permissions Roles Table',
                        'subject.index' => 'Subjects Table',
                        'question.index' => 'Questions Table',
                        'questionOption.index' => 'Question Options Table',
                        'quiz.index' => 'Quizzes Table',
                        'quizQuestion.index' => 'Quiz Questions Table',
                        'attempt.index' => 'Attempt Table',
                        // add more routes here
                    ];

                    $currentPage = $pageTitles[$routeName] ?? 'Dashboard';
                @endphp


                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li class="breadcrumb-item text-sm">
                            <a class="opacity-5 text-dark" href="javascript:;">Pages</a>
                        </li>
                        <li class="breadcrumb-item text-sm text-dark active" aria-current="page">
                            {{ $currentPage }}
                        </li>
                    </ol>
                </nav>
                <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                    <div class="ms-auto d-flex align-items-center gap-3">

                        {{-- (Optional) search input, hidden on small screens --}}
                        <div class="d-none d-md-block">
                            <div class="input-group input-group-outline">
                                <label class="form-label">Search...</label>
                                <input type="text" class="form-control" />
                            </div>
                        </div>

                        {{-- User info pill --}}
                        <div class="d-flex align-items-center px-3 py-2 bg-white border rounded-3 shadow-sm">
                            {{-- Avatar circle with first letter --}}
                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style="width:40px;height:40px;background:#f1f1f1;">
                                <span class="text-uppercase fw-bold" style="font-size:0.9rem;">
                                    {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                                </span>
                            </div>

                            {{-- Name + roles --}}
                            <div class="me-3">
                                <div class="fw-semibold" style="font-size:0.9rem;">
                                    {{ auth()->user()->name }}
                                </div>

                                @php
                                    $roles = auth()->user()->roles->pluck('name');
                                @endphp
                                <div style="font-size:0.75rem;" class="text-muted">
                                    {{ $roles->isNotEmpty() ? $roles->join(' | ') : 'No role' }}
                                </div>
                            </div>

                        </div>

                        {{-- Mobile sidenav toggler --}}
                        <ul class="navbar-nav d-xl-none ps-3 d-flex align-items-center mb-0">
                            <li class="nav-item">
                                <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                                    <div class="sidenav-toggler-inner">
                                        <i class="sidenav-toggler-line"></i>
                                        <i class="sidenav-toggler-line"></i>
                                        <i class="sidenav-toggler-line"></i>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </nav>




        <!-- End Navbar -->
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">



                    @yield('content')



                </div>
            </div>
        </div>
    </main>





    <!--   Core JS Files   -->
    <script src="../assets/js/core/popper.min.js"></script>
    <script src="../assets/js/core/bootstrap.min.js"></script>
    <script src="../assets/js/plugins/perfect-scrollbar.min.js"></script>
    <script src="../assets/js/plugins/smooth-scrollbar.min.js"></script>
    <script>
        var win = navigator.platform.indexOf("Win") > -1;
        if (win && document.querySelector("#sidenav-scrollbar")) {
            var options = {
                damping: "0.5",
            };
            Scrollbar.init(document.querySelector("#sidenav-scrollbar"), options);
        }
    </script>
    <!-- Github buttons -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <!-- Control Center for Material Dashboard: parallax effects, scripts for the example pages etc -->
    <script src="../assets/js/material-dashboard.min.js?v=3.0.0"></script>


    <!-- JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="{{ asset('js/User.js') }}"></script>
    <script src="{{ asset('js/Role.js') }}"></script>
    <script src="{{ asset('js/RoleUser.js') }}"></script>
    <script src="{{ asset('js/Permission.js') }}"></script>
    <script src="{{ asset('js/PermissionRole.js') }}"></script>
    <script src="{{ asset('js/Subject.js') }}"></script>
    <script src="{{ asset('js/Question.js') }}"></script>
    <script src="{{ asset('js/QuestionOption.js') }}"></script>
    <script src="{{ asset('js/Quiz.js') }}"></script>
    <script src="{{ asset('js/QuizQuestion.js') }}"></script>
    <script src="{{ asset('js/QuizAttempt.js') }}"></script>
    <script src="{{ asset('js/QuizAnswer.js') }}"></script>
    <script src="{{ asset('js/Tag.js') }}"></script>
    <script src="{{ asset('js/QuestionTag.js') }}"></script>












</body>

</html>