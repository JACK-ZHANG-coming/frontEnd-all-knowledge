layui.use(['form', 'upload', 'element'], function () {
    const form = layui.form,
          upload = layui.upload,
          element = layui.element,
          $ = layui.$;

    // 添加程序运行状态变量
    let isProgramRunning = false;

    // 获取程序运行状态
    function getProgramStatus() {
        fetch("/get_program_status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                updateButtonState(data.data.running);
            }
        })
        .catch(error => {
            console.error("获取程序状态失败:", error);
        });
    }

    // 更新按钮状态的函数
    function updateButtonState(isRunning) {
        isProgramRunning = isRunning;
        if (isRunning) {
            $("#startProgram").hide();
            $("#stopProgram").show();
            $("#saveConfig").addClass('layui-btn-disabled').prop('disabled', true);
            // 停止按钮需要使能
            $("#stopProgram").removeClass('layui-btn-disabled').prop('disabled', false);
        } else {
            $("#startProgram").show();
            $("#stopProgram").hide();
            $("#saveConfig").removeClass('layui-btn-disabled').prop('disabled', false);
            // 开始按钮需要使能
            $("#startProgram").removeClass('layui-btn-disabled').prop('disabled', false);
        }
    }

    // 监听LLM类型选择变化
    form.on('select(llm_type)', function(data){
        // 隐藏所有配置区域
        $('#anythingllm_config, #dify_config').hide();
        // 隐藏获取模型列表按钮
        $('#getModelsBtn').hide();
        
        // 根据选择显示对应配置
        if(data.value === 'anythingllm') {
            $('#anythingllm_config').show();
            // 设置默认API地址
            if(!$('#llm_api_url').val()) {
                $('#llm_api_url').val('http://127.0.0.1:3001');
            }
        } else if(data.value === 'dify') {
            $('#dify_config').show();
            // 设置默认API地址
            if(!$('#llm_api_url').val()) {
                $('#llm_api_url').val('https://api.dify.ai');
            }
        } else if(data.value === 'openai') {
            // 显示获取模型列表按钮
            $('#getModelsBtn').show();
        }
    });

    // 监听SSL开关变化
    form.on('switch(sslSwitch)', function(data){
        if(data.elem.checked) {
            $('#ssl_config').show();
            // 设置ssl值为"on"
            $('input[name="ssl"]').val("on");
        } else {
            $('#ssl_config').hide();
            // 设置ssl值为"off"
            $('input[name="ssl"]').val("off");
        }
    });

    // 自定义验证规则
    form.verify({
        port: function(value) {
            if(!/^\d+$/.test(value)) {
                return '端口必须为数字';
            }
            const port = parseInt(value);
            if(port < 1 || port > 65535) {
                return '端口范围必须在1-65535之间';
            }
        },
        positiveInt: function(value) {
            if(!/^\d+$/.test(value)) {
                return '必须为正整数';
            }
            if(parseInt(value) <= 0) {
                return '必须大于0';
            }
        },
        url: function(value) {
            if(value === '') return;
            try {
                new URL(value);
            } catch(e) {
                return 'URL格式不正确';
            }
        }
    });

    // 监听数字人选择变化
    form.on('select(avatarSelect)', function(data){
        loadAvatarPreview(data.value);
    });

    // 加载头像列表
    function loadAvatarList() {
        fetch("/get_avatar_list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ret === 0) {
                const select = $("#avatar_id");
                const currentValue = select.val();
                select.empty();
                select.append('<option value="">请选择数字人模型</option>');
                data.data.forEach(avatar => {
                    select.append(`<option value="${avatar}">${avatar}</option>`);
                });

                if (!currentValue) {
                    fetch("/load_config", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(response => response.json())
                    .then(configData => {
                        if (configData.ret === 0 && configData.data.avatar_id) {
                            select.val(configData.data.avatar_id);
                        }
                        form.render('select');
                    })
                    .catch(error => {
                        console.error("Error loading config:", error);
                        form.render('select');
                    });
                } else {
                    select.val(currentValue);
                    form.render('select');
                }
            } else {
                layer.msg(data.msg, { icon: 2, time: 3000 });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            layer.msg('获取头像列表失败：' + error, { icon: 2, time: 3000 });
        });
    }

    // 刷新按钮点击事件
    $("#refreshAvatars").on("click", function () {
        loadAvatarList();
        layer.msg('刷新头像列表...', { icon: 16, time: 500 });
    });

    // 删除数字人按钮点击事件
    $('#deleteAvatar').on('click', function() {
        var currentAvatar = $('#avatar_id').val();
        if (!currentAvatar) {
            layer.msg('请先选择要删除的数字人模型');
            return;
        }

        layer.confirm('确定要删除数字人模型 "' + currentAvatar + '" 吗？此操作不可恢复！', {
            btn: ['确定','取消'],
            title: '删除确认'
        }, function(index){
            layer.close(index);
            
            // 发送删除请求
            $.ajax({
                url: '/delete_avatar/' + currentAvatar,
                type: 'DELETE',
                success: function(res) {
                    if (res.ret === 0) {
                        layer.msg(res.msg);
                        // 重新加载数字人列表
                        loadAvatarList();
                        // 清空选择
                        $('#avatar_id').val('');
                        form.render('select');
                    } else {
                        layer.msg(res.msg || '删除失败');
                    }
                },
                error: function() {
                    layer.msg('删除请求失败，请检查网络连接');
                }
            });
        });
    });

    function loadConfig() {
        fetch("/load_config", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            var config = data.data;
            $.each(config, function(key, value) {
                var $elem = $("input[name='" + key + "'], select[name='" + key + "']");
                
                // 特殊处理SSL开关
                if(key === 'ssl') {
                    if(value === 'on') {
                        $('input[name="ssl"]').prop('checked', true);
                        $('input[name="ssl"]').val("on");
                        $('#ssl_config').show();
                    } else {
                        $('input[name="ssl"]').prop('checked', false);
                        $('input[name="ssl"]').val("off");
                        $('#ssl_config').hide();
                    }
                } else {
                    $elem.val(value);
                }
                
                // 根据TTS类型显示/隐藏相关字段
                if(key === 'tts') {
                    const vitsFields = ['#tts_type', '#speaker_id', '#tts_length'];
                    if(value === 'vits-simple-api') {
                        vitsFields.forEach(field => {
                            $(field).closest('.layui-inline').show();
                        });
                    } else {
                        vitsFields.forEach(field => {
                            $(field).closest('.layui-inline').hide();
                        });
                    }

                    // 显示/隐藏Azure TTS配置
                    if(value === 'azure-tts') {
                        $('#azure_tts_config').show();
                    } else {
                        $('#azure_tts_config').hide();
                    }
                }

                if(key === 'llm_type') {
                    form.val('configForm', {
                        llm_type: value
                    });
                    // 根据LLM类型显示/隐藏相关配置
                    $('#anythingllm_config, #dify_config').hide();
                    $('#getModelsBtn').hide();
                    
                    if(value === 'anythingllm') {
                        $('#anythingllm_config').show();
                        // 设置默认API地址
                        if(!$('#llm_api_url').val()) {
                            $('#llm_api_url').val('http://127.0.0.1:3001');
                        }
                    } else if(value === 'dify') {
                        $('#dify_config').show();
                        // 设置默认API地址
                        if(!$('#llm_api_url').val()) {
                            $('#llm_api_url').val('http://127.0.0.1');
                        }
                    } else if(value === 'openai') {
                        // 显示获取模型列表按钮
                        $('#getModelsBtn').show();
                    }
                }

                // 如果是avatar_id且有值，加载预览图
                if(key === 'avatar_id' && value) {
                    loadAvatarPreview(value);
                }
            });

            // 加载key.txt中的卡密
            fetch("/load_auth_key", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.ret === 0 && data.data) {
                    $("#auth_key").val(data.data);
                }
            })
            .catch(error => {
                console.error("Error loading auth key:", error);
            });

            // 处理CosyVoice的特殊配置
            if(config.tts === 'cosyvoice') {
                $('#cosyvoice_config').show();
                handleTTSModeChange(config.tts_mode || '预训练音色');
                
                // 设置CosyVoice特有的配置项
                $('#tts_mode').val(config.tts_mode || '预训练音色');
                $('#tts_voice').val(config.tts_voice || '');
                $('#tts_version').val(config.tts_version || '');
                $('#tts_speed').val(config.tts_speed || 1.0);
                
                form.render('select'); // 重新渲染select
            }

            form.render();
            layer.msg('读取配置成功', {icon: 1, time: 2000});
        })
        .catch(error => {
            console.error("Error:", error);
            layer.msg('读取配置失败，' + error, {icon: 2, time: 5000});
        });
    }

    // 抽取预览图加载逻辑为独立函数
    function loadAvatarPreview(avatarId) {
        if (!avatarId) {
            $('.avatar-preview').hide();
            return;
        }

        // 显示预览区域
        $('.avatar-preview').show();
        $('#previewError').hide();
        $('#avatarPreview').hide();

        // 加载预览图
        fetch('/get_avatar_preview/' + avatarId)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.msg || '加载预览图失败');
                });
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            $('#avatarPreview').attr('src', imageUrl).show();
        })
        .catch(error => {
            $('#previewError').text(error.message).show();
            $('#avatarPreview').hide();
        });
    }

    // 保存配置
    $("#saveConfig").on("click", function () {
        if(isProgramRunning) {
            layer.msg('请先停止程序运行', {icon: 2, time: 3000});
            return;
        }

        const config = form.val("configForm");
        
        // 验证所有必填字段
        if(!form.validate("#config-form")) {
            return;
        }

        // 保存卡密到key.txt
        const authKey = $("#auth_key").val();
        if(authKey) {
            fetch("/save_auth_key", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({auth_key: authKey})
            })
            .then(response => response.json())
            .then(data => {
                if(data.ret !== 0) {
                    layer.msg(data.msg || "保存卡密失败", {icon: 2, time: 3000});
                }
            })
            .catch(error => {
                layer.msg("保存卡密失败: " + error, {icon: 2, time: 3000});
            });
        }

        // 根据LLM类型选择正确的对话模式值
        var llmType = config.llm_type;
        if(llmType === 'anythingllm') {
            config.llm_mode = $('#llm_mode_anything').val() || 'chat';
        } else if(llmType === 'dify') {
            config.llm_mode = $('#llm_mode_dify').val() || '聊天助手';
        } else {
            config.llm_mode = 'chat'; // 默认值
        }

        config.ssl = $('input[name="ssl"]').val();
        config.llm_filter_markdown = $('input[name="llm_filter_markdown"]').val();

        // 根据TTS类型添加特殊配置
        if(config.tts === 'cosyvoice') {
            config.tts_mode = $('#tts_mode').val();
            config.tts_speed = parseFloat($('#tts_speed').val());
            
            if(config.tts_mode === '预训练音色') {
                config.tts_voice = $('#tts_voice').val();
                config.tts_version = $('#tts_version').val();
            }
            // REF_FILE 和 REF_TEXT 已经在基础配置中包含
        }

        // 删除临时字段
        delete config.llm_mode_anything;
        delete config.llm_mode_dify;

        // 打印最终配置
        console.log('最终配置:', config);

        fetch("/save_config", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            layer.msg(data.message, {icon: 1, time: 3000});
            // 重新加载配置
            loadConfig();
        })
        .catch(error => layer.msg("保存失败: " + error, {icon: 2, time: 5000}));
    });

    // 启动程序
    $("#startProgram").on("click", function () {
        if (isProgramRunning) return;

        const config = form.val("configForm");
        // 根据LLM类型选择正确的对话模式值
        var llmType = config.llm_type;
        if(llmType === 'anythingllm') {
            config.llm_mode = $('#llm_mode_anything').val() || 'chat';
        } else if(llmType === 'dify') {
            config.llm_mode = $('#llm_mode_dify').val() || '聊天助手';
        } else {
            config.llm_mode = 'chat'; // 默认值
        }

        config.ssl = $('input[name="ssl"]').val();
        config.llm_filter_markdown = $('input[name="llm_filter_markdown"]').val();

        // 根据TTS类型添加特殊配置
        if(config.tts === 'cosyvoice') {
            config.tts_mode = $('#tts_mode').val();
            config.tts_speed = parseFloat($('#tts_speed').val());
            
            if(config.tts_mode === '预训练音色') {
                config.tts_voice = $('#tts_voice').val();
                config.tts_version = $('#tts_version').val();
            }
            // REF_FILE 和 REF_TEXT 已经在基础配置中包含
        }

        // 删除临时字段
        delete config.llm_mode_anything;
        delete config.llm_mode_dify;
        
        $(this).addClass('layui-btn-disabled').prop('disabled', true);

        fetch("/start_program", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })
        .then(response => response.json())
        .then(data => {
            layer.msg(data.message + " 密钥验证结果请查看CMD日志！", { icon: 1, time: 5000 });
            updateButtonState(true);
        })
        .catch(error => {
            layer.msg("启动失败: " + error, { icon: 2, time: 5000 });
            $(this).removeClass('layui-btn-disabled').prop('disabled', false);
        });
    });

    // 停止程序
    $("#stopProgram").on("click", function () {
        if (!isProgramRunning) return;

        $(this).addClass('layui-btn-disabled').prop('disabled', true);

        fetch("/stop_program", {
            method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            layer.msg(data.message, { icon: 1, time: 3000 });
            updateButtonState(false);
        })
        .catch(error => {
            layer.msg("停止失败: " + error, { icon: 2, time: 5000 });
            $(this).removeClass('layui-btn-disabled').prop('disabled', false);
        });
    });

    // 文件上传
    upload.render({
        elem: '#videoUpload',
        auto: false, // 不自动上传
        accept: 'video',
        acceptMime: 'video/mp4',
        field: 'video_file',
        choose: function(obj) {
            // 清除之前的选择
            $('#training-form').removeData('video_file');
            $('#selected-video-name').text('');
            $('#selected-video-info').hide();
            
            // 预读本地文件
            obj.preview(function(index, file, result) {
                // 保存文件对象到表单
                $('#training-form').data('video_file', file);
                layer.msg('已选择视频：' + file.name, {icon: 1});
                
                // 显示文件名
                $('#selected-video-name').text(file.name);
                $('#selected-video-info').show();
            });
        }
    });

    // 开始训练按钮点击事件
    $('#startTraining').on('click', function() {
        const videoFile = $('#training-form').data('video_file');
        if (!videoFile) {
            layer.msg('请先选择视频文件', {icon: 2});
            return;
        }

        const avatarId = $('input[name="avatar_id"]').val();
        const imgSize = $('input[name="img_size"]').val();
        const batchSize = $('input[name="batch_size"]').val();

        // 创建FormData对象
        const formData = new FormData();
        formData.append('avatar_id', avatarId);
        formData.append('video_file', videoFile);
        formData.append('img_size', imgSize);
        formData.append('batch_size', batchSize);

        // 显示上传进度
        const loadingIndex = layer.load(1, {
            shade: [0.3, '#fff']
        });

        // 先上传视频，成功后开始训练
        $.ajax({
            url: '/upload_and_train',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(res) {
                layer.close(loadingIndex);
                if(res.ret === 0) {
                    layer.msg('训练任务已启动', {icon: 1});
                    loadTaskList();
                    // 清除已选择的文件
                    $('#training-form').removeData('video_file');
                    $('#selected-video-name').text('');
                    $('#selected-video-info').hide();
                    // 重置上传组件
                    upload.render({
                        elem: '#videoUpload',
                        auto: false,
                        accept: 'video',
                        acceptMime: 'video/mp4',
                        field: 'video_file'
                    });
                } else {
                    layer.msg(res.msg, {icon: 2});
                }
            },
            error: function() {
                layer.close(loadingIndex);
                layer.msg('启动训练失败', {icon: 2});
            }
        });
    });

    // 加载任务列表
    function loadTaskList() {
        $.ajax({
            url: '/list_training_tasks',
            type: 'GET',
            success: function(res) {
                if(res.ret === 0) {
                    updateTaskList(res.data);
                }
            }
        });
    }

    // 更新任务列表显示
    function updateTaskList(tasks) {
        const taskList = $('#taskList');
        taskList.empty();

        tasks.forEach(task => {
            const taskElement = $('<div class="task-item"></div>');
            taskElement.html(`
                <div class="task-info">
                    <div class="task-main">
                        <span>任务ID: ${task.task_id}</span>
                        <span class="task-status status-${task.status === '运行中' ? 'running' : 
                                                        task.status === '已完成' ? 'completed' : 
                                                        task.status === '失败' ? 'failed' : 'stopped'}">${task.status}</span>
                        <span>开始时间: ${new Date(task.start_time * 1000).toLocaleString()}</span>
                    </div>
                    <div class="task-actions">
                        ${task.status === '运行中' ? 
                            `<button type="button" class="layui-btn layui-btn-danger layui-btn-sm stop-task" data-taskid="${task.task_id}">停止</button>` : 
                            `<button type="button" class="layui-btn layui-btn-danger layui-btn-sm delete-task" data-taskid="${task.task_id}">删除</button>`}
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style="width: ${task.progress}%"></div>
                    </div>
                    <div class="task-message">${task.message || ''}</div>
                </div>
            `);
            taskList.append(taskElement);
        });

        // 绑定事件处理程序
        $('.stop-task').on('click', function() {
            const taskId = $(this).data('taskid');
            window.stopTask(taskId);
        });

        $('.delete-task').on('click', function() {
            const taskId = $(this).data('taskid');
            window.deleteTask(taskId);
        });
    }

    // 全局函数定义
    window.stopTask = function(taskId) {
        layui.jquery.ajax({
            url: `/stop_training/${taskId}`,
            type: 'POST',
            success: function(res) {
                if(res.ret === 0) {
                    layui.layer.msg('任务已停止', {icon: 1});
                    loadTaskList();
                } else {
                    layui.layer.msg(res.msg, {icon: 2});
                }
            }
        });
    };

    window.deleteTask = function(taskId) {
        layui.layer.confirm('确定要删除该任务吗？', {icon: 3, title:'提示'}, function(index){
            layui.jquery.ajax({
                url: `/delete_training_task/${taskId}`,
                type: 'DELETE',
                success: function(res) {
                    if(res.ret === 0) {
                        layui.layer.msg('任务已删除', {icon: 1});
                        loadTaskList();
                    } else {
                        layui.layer.msg(res.msg, {icon: 2});
                    }
                }
            });
            layui.layer.close(index);
        });
    };

    // 获取模型列表按钮点击事件
    $('#getModelsBtn').on('click', function() {
        // 获取当前API配置
        var api_url = $('#llm_api_url').val();
        var api_key = $('#llm_api_key').val();

        if (!api_url || !api_key) {
            layer.msg('请先填写API地址和密钥', {icon: 2});
            return;
        }

        // 显示加载中
        var loadIndex = layer.load(2);

        // 调用获取模型列表接口
        $.ajax({
            url: api_url + '/models',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + api_key
            },
            success: function(response) {
                layer.close(loadIndex);
                
                // 创建模型列表HTML
                var modelListHtml = '<div class="model-list-container" style="max-height: 400px; overflow-y: auto;">';
                response.data.forEach(function(model) {
                    modelListHtml += '<div class="model-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;" data-model="' + model.id + '">' + model.id + '</div>';
                });
                modelListHtml += '</div>';

                // 显示模型列表弹窗
                layer.open({
                    type: 1,
                    title: '可用模型列表（点击选择）',
                    area: ['400px', '500px'],
                    content: modelListHtml,
                    success: function(layero, index) {
                        // 点击模型项时设置模型ID
                        $('.model-item').on('click', function() {
                            var modelId = $(this).data('model');
                            $('#llm_model').val(modelId);
                            layer.msg('已选择模型: ' + modelId);
                            layer.close(index);
                        });
                    }
                });
            },
            error: function(xhr, status, error) {
                layer.close(loadIndex);
                layer.msg('获取模型列表失败: ' + (xhr.responseJSON?.error?.message || error), {icon: 2});
            }
        });
    });

    // 绑定解绑卡密按钮点击事件
    $('#unbindAuthKey').on('click', function() {
        layer.confirm('确定要解绑当前卡密吗？', {
            btn: ['确定', '取消']
        }, function(index) {
            layer.close(index);
            
            // 显示加载中
            var loadIndex = layer.load(1, {
                shade: [0.1, '#fff']
            });
            
            // 发送解绑请求
            $.ajax({
                url: '/unbind_auth_key',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({auth_key: $('#auth_key').val()}),
                success: function(res) {
                    layer.close(loadIndex);
                    if (res.ret === 0) {
                        layer.msg('卡密解绑成功', {icon: 1});
                    } else {
                        layer.msg(res.msg || '解绑失败', {icon: 2});
                    }
                },
                error: function(xhr) {
                    layer.close(loadIndex);
                    layer.msg('请求失败: ' + xhr.statusText, {icon: 2});
                }
            });
        });
    });

    // TTS类型切换事件处理
    form.on('select(ttsSelect)', function(data){
        // 隐藏所有特殊配置区域
        $('#cosyvoice_config').hide();
        $('#azure_tts_config').hide();
        
        // 显示/隐藏vits-simple-api相关字段
        const vitsFields = ['#tts_type', '#speaker_id', '#tts_length'];
        if(data.value === 'vits-simple-api') {
            vitsFields.forEach(field => {
                $(field).closest('.layui-inline').show();
            });
        } else {
            vitsFields.forEach(field => {
                $(field).closest('.layui-inline').hide();
            });
        }
        
        // 根据选择显示对应配置区域
        if(data.value === 'cosyvoice') {
            $('#cosyvoice_config').show();
            // 触发一次模式选择，以正确显示/隐藏相关选项
            form.val('configForm', {
                tts_mode: '预训练音色'
            });
            handleTTSModeChange('预训练音色');
        } else if(data.value === 'azure-tts') {
            $('#azure_tts_config').show();
        }
    });

    // CosyVoice TTS模式切换事件处理
    form.on('select(tts_mode)', function(data){
        handleTTSModeChange(data.value);
    });

    // 处理TTS模式切换
    function handleTTSModeChange(mode) {
        if(mode === '预训练音色') {
            $('.pretrained-options').show();
            // 克隆模式的字段仍然可见，但添加说明这是针对克隆模式的
        } else {
            $('.pretrained-options').hide();
        }
    }

    // 初始化
    loadConfig();
    loadAvatarList();
    getProgramStatus();
    loadTaskList();

    // 定时检查程序状态
    setInterval(getProgramStatus, 5000);

    // 定时更新任务列表
    setInterval(loadTaskList, 5000);
});